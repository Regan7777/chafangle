/**
 * 高品质极简出版物触感音效引擎 (Tactile Sound Engine)
 * 基于 Web Audio API 程序化纯代码合成，0 外部音频文件依赖，体积 0 字节，0 毫秒延迟。
 */

let audioCtx: AudioContext | null = null;
let lastPlayTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * 播放清脆短促的机械触感「卡塔」微音效
 * 声音构成：
 * 1. "咔" (Ka): 极高频瞬态机械触点声 (~2100Hz 快速衰减至 ~750Hz, 12ms)
 * 2. "嗒" (Ta): 极低频微弱底座共鸣 (~360Hz 衰减至 ~120Hz, 18ms)
 */
export function playTactileClick(): void {
  const now = Date.now();
  // 节流阀：限制 50ms 触发间隔，防止鼠标在边缘极速滑动时产生嘈杂的音频堆叠
  if (now - lastPlayTime < 50) return;
  lastPlayTime = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // 1. "咔" (高频轻微触点)
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(2100, t);
    oscHigh.frequency.exponentialRampToValueAtTime(750, t + 0.012);

    gainHigh.gain.setValueAtTime(0.045, t);
    gainHigh.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(t);
    oscHigh.stop(t + 0.012);

    // 2. "嗒" (轻微底座共鸣)
    const oscLow = ctx.createOscillator();
    const gainLow = ctx.createGain();
    oscLow.type = 'triangle';
    oscLow.frequency.setValueAtTime(360, t + 0.006);
    oscLow.frequency.exponentialRampToValueAtTime(120, t + 0.02);

    gainLow.gain.setValueAtTime(0.03, t + 0.006);
    gainLow.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    oscLow.connect(gainLow);
    gainLow.connect(ctx.destination);
    oscLow.start(t + 0.006);
    oscLow.stop(t + 0.02);
  } catch {
    // 静默降级
  }
}

/**
 * 全局初始化卡片与按钮悬停音效监听
 */
export function initCardSoundEffects(): () => void {
  if (typeof window === 'undefined') return () => {};

  let lastTarget: Element | null = null;

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // 仅在带有显式 data-sound="card" 的专属卡片（如导航页卡片）上触发微触感音效，杜绝文章列表和正文的嘈杂触发
    const interactiveCard = target.closest<HTMLElement>('[data-sound="card"]');

    if (interactiveCard && interactiveCard !== lastTarget) {
      lastTarget = interactiveCard;
      playTactileClick();
    }
  };

  const handleMouseOut = (e: MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !related.closest('[data-sound="card"]')) {
      lastTarget = null;
    }
  };

  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

  document.addEventListener('mouseover', handleMouseOver, { passive: true });
  document.addEventListener('mouseout', handleMouseOut, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
  };
}
