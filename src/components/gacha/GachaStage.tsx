'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

/**
 * 写真ガチャの3D演出（three.js / WebGL）。ガチャ画面を開いたときだけ three を読み込む。
 * 光る台座の上でカプセルが回り、play() で「落ちてくる → 揺れて光が強まる → 割れて光があふれる」を再生する。
 * ブルーム（光のにじみ）をかけて、発光部分が本物の光のように見えるようにしている。
 * play() はカプセルが割れて画面が光った瞬間に resolve するので、そこで結果を重ねて出す。
 */

export type GachaStageHandle = {
  /** 演出を再生（gold: 10連などの特別なカプセル） */
  play: (opts: { gold?: boolean }) => Promise<void>
  /** 再生中ならすぐ割れた状態まで飛ばす */
  skip: () => void
  /** 待機状態に戻す */
  reset: () => void
}

type Phase = 'idle' | 'drop' | 'shake' | 'burst' | 'after'
type Palette = { shell: number; glow: number; metal?: boolean }

const PALETTES: Palette[] = [
  { shell: 0xff5c93, glow: 0xff8fb8 }, // ローズ
  { shell: 0xa77bff, glow: 0xcdb2ff }, // ラベンダー
  { shell: 0x52b8ff, glow: 0xa9dcff }, // スカイ
]
const GOLD: Palette = { shell: 0xf4c25a, glow: 0xffd98a, metal: true }

export const GachaStage = forwardRef<GachaStageHandle, { className?: string }>(function GachaStage({ className }, ref) {
  const mountRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<{ play: (gold: boolean) => Promise<void>; skip: () => void; reset: () => void } | null>(null)
  const pendingRef = useRef<{ gold: boolean; resolve: () => void } | null>(null)

  useImperativeHandle(ref, () => ({
    play: ({ gold = false }) => {
      if (apiRef.current) return apiRef.current.play(gold)
      // three の読み込み前に押されたら、読み込み後に再生する
      return new Promise<void>(resolve => { pendingRef.current = { gold, resolve } })
    },
    skip: () => apiRef.current?.skip(),
    reset: () => apiRef.current?.reset(),
  }), [])

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    ;(async () => {
      const THREE = await import('three')
      const [{ RoomEnvironment }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
        import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        import('three/examples/jsm/postprocessing/OutputPass.js'),
      ])
      const mount = mountRef.current
      if (disposed || !mount) return

      // ── レンダラー・シーン ───────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex

      const canvasTex = (size: number, draw: (g: CanvasRenderingContext2D, s: number) => void) => {
        const c = document.createElement('canvas')
        c.width = c.height = size
        draw(c.getContext('2d')!, size)
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        return t
      }
      const radial = (stops: [number, string][], size = 128) => canvasTex(size, (g, s) => {
        const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
        stops.forEach(([o, c]) => grd.addColorStop(o, c))
        g.fillStyle = grd
        g.fillRect(0, 0, s, s)
      })

      // 背景：中央が明るいプラム色のステージ
      const bgTex = canvasTex(512, (g, s) => {
        const grd = g.createRadialGradient(s / 2, s * 0.42, 0, s / 2, s * 0.42, s * 0.75)
        grd.addColorStop(0, '#5a2346')
        grd.addColorStop(0.45, '#2a1024')
        grd.addColorStop(1, '#0b0610')
        g.fillStyle = grd
        g.fillRect(0, 0, s, s)
      })
      scene.background = bgTex

      const sparkTex = radial([[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']], 64)
      const softTex = radial([[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']])
      const starTex = canvasTex(64, (g, s) => {
        // 十字にきらめく星
        g.translate(s / 2, s / 2)
        const grd = g.createRadialGradient(0, 0, 0, 0, 0, s / 2)
        grd.addColorStop(0, 'rgba(255,255,255,1)')
        grd.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = grd
        g.beginPath(); g.moveTo(0, -s / 2); g.lineTo(3, 0); g.lineTo(0, s / 2); g.lineTo(-3, 0); g.closePath(); g.fill()
        g.beginPath(); g.moveTo(-s / 2, 0); g.lineTo(0, 3); g.lineTo(s / 2, 0); g.lineTo(0, -3); g.closePath(); g.fill()
        g.beginPath(); g.arc(0, 0, 5, 0, Math.PI * 2); g.fill()
      })
      const rayTex = canvasTex(512, (g, s) => {
        g.translate(s / 2, s / 2)
        g.filter = 'blur(5px)'
        for (let i = 0; i < 16; i++) {
          g.rotate((Math.PI * 2) / 16)
          g.fillStyle = i % 2 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'
          g.beginPath(); g.moveTo(0, 0); g.lineTo(s / 2, -20); g.lineTo(s / 2, 20); g.closePath(); g.fill()
        }
        g.filter = 'none'
        g.globalCompositeOperation = 'destination-in'
        const mask = g.createRadialGradient(0, 0, 0, 0, 0, s / 2)
        mask.addColorStop(0, 'rgba(0,0,0,1)')
        mask.addColorStop(0.5, 'rgba(0,0,0,0.45)')
        mask.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = mask
        g.fillRect(-s / 2, -s / 2, s, s)
      })

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
      const camHome = new THREE.Vector3(0, 0.75, 7.4)
      const camNear = new THREE.Vector3(0, 0.45, 5.6)
      camera.position.copy(camHome)
      camera.lookAt(0, -0.05, 0)

      const key = new THREE.DirectionalLight(0xffffff, 1.7)
      key.position.set(3, 5, 4)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xff8fb8, 1.6)
      rim.position.set(-4, 2, -3)
      scene.add(rim)
      const rim2 = new THREE.DirectionalLight(0xffd98a, 0.9)
      rim2.position.set(4, 1, -3)
      scene.add(rim2)

      // ── ポストプロセス（ブルーム）──────────────────────────────────────
      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.5, 0.78)
      composer.addPass(bloom)
      composer.addPass(new OutputPass())

      // ── 後光（いつもゆっくり回り、割れた瞬間に強くなる）───────────────
      const raysMat = new THREE.MeshBasicMaterial({ map: rayTex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffb6cf })
      const rays = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), raysMat)
      rays.position.set(0, 0.1, -2.5)
      scene.add(rays)
      const rays2Mat = raysMat.clone()
      rays2Mat.opacity = 0.06
      const rays2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), rays2Mat)
      rays2.position.set(0, 0.1, -2.4)
      scene.add(rays2)

      // ── ぼけた光（奥でゆっくり漂う）────────────────────────────────────
      const bokehColors = [0xff7aa8, 0xffd27a, 0xb68cff, 0xff9ec4, 0x8fd0ff]
      const bokeh: { s: InstanceType<typeof THREE.Sprite>; m: InstanceType<typeof THREE.SpriteMaterial>; vx: number; vy: number; base: number; ph: number }[] = []
      for (let i = 0; i < 22; i++) {
        const m = new THREE.SpriteMaterial({
          map: softTex, color: bokehColors[i % bokehColors.length], transparent: true,
          opacity: 0.12 + Math.random() * 0.18, blending: THREE.AdditiveBlending, depthWrite: false,
        })
        const s = new THREE.Sprite(m)
        s.position.set((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6, -3 - Math.random() * 3)
        s.scale.setScalar(0.5 + Math.random() * 1.4)
        scene.add(s)
        bokeh.push({ s, m, vx: (Math.random() - 0.5) * 0.12, vy: 0.05 + Math.random() * 0.12, base: m.opacity, ph: Math.random() * 6 })
      }

      // ── きらめく星 ────────────────────────────────────────────────────
      const stars: { s: InstanceType<typeof THREE.Sprite>; m: InstanceType<typeof THREE.SpriteMaterial>; ph: number; sp: number; size: number }[] = []
      for (let i = 0; i < 26; i++) {
        const m = new THREE.SpriteMaterial({ map: starTex, color: i % 3 ? 0xffffff : 0xffe2a6, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
        const s = new THREE.Sprite(m)
        s.position.set((Math.random() - 0.5) * 6.5, (Math.random() - 0.2) * 4, -1 - Math.random() * 2)
        const size = 0.12 + Math.random() * 0.22
        s.scale.setScalar(size)
        scene.add(s)
        stars.push({ s, m, ph: Math.random() * 6.28, sp: 1.5 + Math.random() * 2.5, size })
      }

      // ── 台座 ──────────────────────────────────────────────────────────
      const pedestal = new THREE.Group()
      pedestal.position.y = -1.45
      scene.add(pedestal)
      pedestal.add(new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.75, 0.32, 96),
        new THREE.MeshPhysicalMaterial({ color: 0x1b0f18, metalness: 0.6, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }),
      ))
      const trim = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.035, 16, 128), new THREE.MeshStandardMaterial({ color: 0xd8b25a, metalness: 1, roughness: 0.2 }))
      trim.rotation.x = Math.PI / 2
      trim.position.y = 0.16
      pedestal.add(trim)
      // 発光リング（ブルームで光る）
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff8fb8).multiplyScalar(2.2), toneMapped: false, transparent: true })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.022, 12, 128), ringMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.17
      pedestal.add(ring)
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.012, 8, 96, Math.PI * 1.4),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd98a).multiplyScalar(1.8), toneMapped: false, transparent: true, opacity: 0.8 }),
      )
      ring2.rotation.x = Math.PI / 2
      ring2.position.y = 0.17
      pedestal.add(ring2)
      // 台座の上の光だまり
      const poolMat = new THREE.MeshBasicMaterial({ map: softTex, color: 0xff8fb8, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
      const pool = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), poolMat)
      pool.rotation.x = -Math.PI / 2
      pool.position.y = 0.175
      pedestal.add(pool)
      // 下から立ちのぼる光の柱
      const beamTex = canvasTex(64, (g, s) => {
        const grd = g.createLinearGradient(0, s, 0, 0)
        grd.addColorStop(0, 'rgba(255,255,255,0.55)')
        grd.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = grd
        g.fillRect(0, 0, s, s)
      })
      const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, color: 0xff9ec4, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.25, 3.2, 48, 1, true), beamMat)
      beam.position.y = 1.75
      pedestal.add(beam)

      // ── カプセル ────────────────────────────────────────────────────
      const capsule = new THREE.Group()
      scene.add(capsule)
      const topMat = new THREE.MeshPhysicalMaterial({
        color: PALETTES[0].shell, roughness: 0.06, metalness: 0, transmission: 0.5, thickness: 0.6, ior: 1.45,
        clearcoat: 1, clearcoatRoughness: 0.04, iridescence: 0.4, transparent: true,
      })
      const bottomMat = new THREE.MeshPhysicalMaterial({ color: 0xfbf7f9, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true })
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xd8b25a, metalness: 1, roughness: 0.18, transparent: true })
      const top = new THREE.Group()
      top.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), topMat))
      const bottom = new THREE.Group()
      bottom.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), bottomMat))
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 16, 96), bandMat)
      band.rotation.x = Math.PI / 2
      bottom.add(band)
      capsule.add(top, bottom)

      const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTES[0].glow).multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: 0.9, depthWrite: false })
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16), coreMat)
      capsule.add(core)
      const coreLight = new THREE.PointLight(PALETTES[0].glow, 3, 7)
      capsule.add(coreLight)
      const haloMat = new THREE.SpriteMaterial({ map: softTex, color: PALETTES[0].glow, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false })
      const halo = new THREE.Sprite(haloMat)
      halo.scale.setScalar(4.2)
      capsule.add(halo)

      // 割れたときに広がる光の輪
      const shockMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffe6b0).multiplyScalar(2), toneMapped: false, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
      const shock = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 96), shockMat)
      scene.add(shock)

      // ── 光の粒（割れたときに飛び散る）──────────────────────────────────
      const N = 320
      const pos = new Float32Array(N * 3)
      const vel = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      const sparkGeo = new THREE.BufferGeometry()
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      sparkGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const sparkMat = new THREE.PointsMaterial({
        map: sparkTex, size: 0.16, transparent: true, opacity: 0, vertexColors: true,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })
      scene.add(new THREE.Points(sparkGeo, sparkMat))

      // ── 状態と時間軸 ─────────────────────────────────────────────────
      let phase: Phase = 'idle'
      let phaseStart = performance.now()
      let resolvePlay: (() => void) | null = null
      let palette: Palette = PALETTES[0]
      const T = { drop: 800, shake: 1450, burst: 750 }

      const burstSparks = () => {
        const a = new THREE.Color(palette.glow).multiplyScalar(2)
        const b = new THREE.Color(0xffe0a0).multiplyScalar(2)
        const w = new THREE.Color(0xffffff).multiplyScalar(2)
        for (let i = 0; i < N; i++) {
          pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0
          const th = Math.random() * Math.PI * 2
          const ph = Math.acos(2 * Math.random() - 1)
          const sp = 2.5 + Math.random() * 5.5
          vel[i * 3] = Math.sin(ph) * Math.cos(th) * sp
          vel[i * 3 + 1] = Math.abs(Math.cos(ph)) * sp * 0.9 + 1.5
          vel[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * sp * 0.6
          const c = i % 3 === 0 ? a : i % 3 === 1 ? b : w
          col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
        }
        sparkGeo.attributes.position.needsUpdate = true
        sparkGeo.attributes.color.needsUpdate = true
        sparkMat.opacity = 1
      }

      const setPalette = (p: Palette) => {
        palette = p
        topMat.color.setHex(p.shell)
        topMat.metalness = p.metal ? 0.55 : 0
        topMat.transmission = p.metal ? 0.15 : 0.5
        coreMat.color.set(p.glow).multiplyScalar(1.6)
        coreLight.color.setHex(p.glow)
        haloMat.color.setHex(p.glow)
        ringMat.color.set(p.glow).multiplyScalar(2.2)
        poolMat.color.setHex(p.glow)
        beamMat.color.setHex(p.glow)
        raysMat.color.setHex(p.glow)
      }

      const resetPose = () => {
        capsule.position.set(0, 0, 0)
        capsule.rotation.set(0.28, 0, 0.12)
        top.position.set(0, 0, 0); top.rotation.set(0, 0, 0)
        bottom.position.set(0, 0, 0); bottom.rotation.set(0, 0, 0)
        topMat.opacity = 1; bottomMat.opacity = 1; bandMat.opacity = 1
        topMat.emissive.setHex(0x000000)
        core.visible = true; core.scale.setScalar(1); coreMat.opacity = 0.9
        coreLight.intensity = 3
        haloMat.opacity = 0.2; halo.scale.setScalar(4.2)
        raysMat.opacity = 0.1
        shockMat.opacity = 0
        sparkMat.opacity = 0
        bloom.strength = 0.6
        camera.position.copy(camHome)
        if (flashRef.current) { flashRef.current.style.transition = 'none'; flashRef.current.style.opacity = '0' }
      }
      resetPose()

      const go = (p: Phase) => { phase = p; phaseStart = performance.now() }

      const finishBurst = () => {
        go('burst')
        burstSparks()
        shock.position.set(0, 0, 0.2)
        shock.scale.setScalar(0.6)
        shockMat.color.set(palette.glow).multiplyScalar(2.2)
        shockMat.opacity = 1
        if (flashRef.current) {
          flashRef.current.style.transition = 'none'
          flashRef.current.style.opacity = '0.85'
          requestAnimationFrame(() => {
            if (!flashRef.current) return
            flashRef.current.style.transition = 'opacity 900ms ease-out'
            flashRef.current.style.opacity = '0'
          })
        }
        const r = resolvePlay
        resolvePlay = null
        setTimeout(() => r?.(), 260)
      }

      const easeOutBounce = (x: number) => {
        const n1 = 7.5625, d1 = 2.75
        if (x < 1 / d1) return n1 * x * x
        if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75
        if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375
        return n1 * (x -= 2.625 / d1) * x + 0.984375
      }

      apiRef.current = {
        play: (gold: boolean) => new Promise<void>(resolve => {
          resetPose()
          setPalette(gold ? GOLD : PALETTES[Math.floor(Math.random() * PALETTES.length)])
          resolvePlay = resolve
          if (reduceMotion) { finishBurst(); return }
          go('drop')
        }),
        skip: () => { if (phase === 'drop' || phase === 'shake') finishBurst() },
        reset: () => { resetPose(); setPalette(PALETTES[0]); go('idle') },
      }
      if (pendingRef.current) {
        const p = pendingRef.current
        pendingRef.current = null
        apiRef.current.play(p.gold).then(p.resolve)
      }

      // ── サイズ合わせ ─────────────────────────────────────────────────
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        composer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(mount)

      // ── 描画ループ ───────────────────────────────────────────────────
      let raf = 0
      let last = performance.now()
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        const t = now - phaseStart
        const time = now / 1000

        // いつも動いているもの
        rays.rotation.z += dt * 0.12
        rays2.rotation.z -= dt * 0.08
        ring2.rotation.z += dt * 0.9
        ringMat.opacity = 0.75 + Math.sin(time * 2.2) * 0.25
        for (const b of bokeh) {
          b.s.position.x += b.vx * dt
          b.s.position.y += b.vy * dt
          if (b.s.position.y > 3.5) b.s.position.y = -3.5
          b.m.opacity = b.base * (0.7 + 0.3 * Math.sin(time + b.ph))
        }
        for (const st of stars) {
          const k = Math.max(0, Math.sin(time * st.sp + st.ph))
          st.m.opacity = k * k
          st.m.rotation = time * 0.5 + st.ph
          st.s.scale.setScalar(st.size * (0.6 + k * 0.6))
        }

        if (phase === 'idle') {
          capsule.position.y = 0.05 + Math.sin(time * 1.6) * 0.09
          capsule.rotation.y += dt * 0.7
          coreLight.intensity = 3 + Math.sin(time * 2.4) * 0.8
        } else if (phase === 'drop') {
          const k = Math.min(1, t / T.drop)
          capsule.position.y = 4.4 * (1 - easeOutBounce(k))
          capsule.rotation.y += dt * 10 * (1 - k)
          if (k >= 1) go('shake')
        } else if (phase === 'shake') {
          const k = Math.min(1, t / T.shake)
          const amp = 0.05 + k * 0.3
          capsule.rotation.z = 0.12 + Math.sin((t / 1000) * (14 + k * 30)) * amp
          capsule.position.y = Math.abs(Math.sin((t / 1000) * 22)) * 0.07 * k
          capsule.rotation.y += dt * k * 3
          coreLight.intensity = 3 + k * 9
          topMat.emissive.set(palette.glow).multiplyScalar(k * 0.25)
          haloMat.opacity = 0.2 + k * 0.3
          halo.scale.setScalar(4.2 + k * 1.5)
          raysMat.opacity = 0.1 + k * 0.15
          bloom.strength = 0.6 + k * 0.45
          camera.position.lerpVectors(camHome, camNear, k * k)
          // 割れる直前は画面ごと小刻みに揺らす
          if (k > 0.75) camera.position.x += (Math.random() - 0.5) * 0.05 * k
          if (k >= 1) finishBurst()
        } else if (phase === 'burst' || phase === 'after') {
          const k = Math.min(1, t / T.burst)
          const e = 1 - Math.pow(1 - k, 3)
          top.position.set(-e * 1.1, e * 2.2, e * 0.3)
          top.rotation.set(-e * 1.3, 0, e * 1.1)
          bottom.position.set(e * 0.6, -e * 1.4, 0)
          bottom.rotation.set(e * 0.7, 0, -e * 0.5)
          topMat.opacity = 1 - k; bottomMat.opacity = 1 - k; bandMat.opacity = 1 - k
          core.scale.setScalar(1 + e * 1.4)
          coreMat.opacity = 0.9 * (1 - k) * (1 - k)
          core.visible = k < 1
          haloMat.opacity = 0.5 * (1 - k)
          coreLight.intensity = 12 * (1 - k)
          raysMat.opacity = 0.3 + Math.min(0.25, k * 0.5)
          shock.scale.setScalar(0.6 + e * 6)
          shockMat.opacity = Math.max(0, 1 - k * 1.2)
          bloom.strength = 1.05 - e * 0.45
          for (let i = 0; i < N; i++) {
            pos[i * 3] += vel[i * 3] * dt
            pos[i * 3 + 1] += vel[i * 3 + 1] * dt
            pos[i * 3 + 2] += vel[i * 3 + 2] * dt
            vel[i * 3 + 1] -= 3.4 * dt
            vel[i * 3] *= 0.99
          }
          sparkGeo.attributes.position.needsUpdate = true
          sparkMat.opacity = Math.max(0, 1 - t / 2200)
          if (phase === 'burst' && k >= 1) go('after')
        }

        composer.render()
      }
      raf = requestAnimationFrame(loop)

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        scene.traverse(o => {
          const mesh = o as unknown as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | { dispose: () => void }[] }
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
          mats.forEach(m => m.dispose())
        })
        ;[sparkTex, softTex, starTex, rayTex, bgTex, beamTex, envTex].forEach(t => t.dispose())
        composer.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
        apiRef.current = null
      }
    })()

    return () => { disposed = true; cleanup() }
  }, [])

  return (
    <div className={className ?? 'relative'}>
      <div ref={mountRef} className="absolute inset-0 [&>canvas]:w-full [&>canvas]:h-full" />
      <div ref={flashRef} className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, #fff 0%, rgba(255,240,220,0.9) 35%, rgba(255,200,230,0.4) 60%, rgba(255,255,255,0) 80%)', opacity: 0 }} />
    </div>
  )
})
