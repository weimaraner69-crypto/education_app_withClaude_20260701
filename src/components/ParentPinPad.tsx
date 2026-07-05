import { useEffect, useState } from 'react';
import { verifyPin } from '../features/auth/pin';

// 保護者用のPIN（暗証番号）入力画面（仕様書8章）。
// 4桁の数字を入力し、正しければ onSuccess を呼ぶ。子供が勝手に設定画面へ
// 入らないための簡単な仕切り。※本格的な安全対策は Firebase 側で行う（pin.ts 参照）。
const PIN_LENGTH = 4;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

interface ParentPinPadProps {
  pinHash: string; // 照合する保存済みハッシュ
  onSuccess: () => void; // PINが一致したとき
  onBack: () => void; // 子供選択画面へ戻る
}

export default function ParentPinPad({ pinHash, onSuccess, onBack }: ParentPinPadProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // 数字を1つ足す。前回の値をもとに更新するので、速く連打しても桁が抜けない。
  function pushDigit(digit: string) {
    setError(false);
    setPin((prev) => (prev.length >= PIN_LENGTH ? prev : prev + digit));
  }

  function clearPin() {
    setPin('');
    setError(false);
  }

  // 4桁そろったら照合する。照合は非同期（ハッシュ計算）なので、
  // 入力の副作用として useEffect の中で行う。
  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;
    let cancelled = false;
    void verifyPin(pin, pinHash).then((ok) => {
      if (cancelled) return;
      if (ok) {
        onSuccess();
      } else {
        // 間違いのときは印を出して入力をクリアする。
        setError(true);
        setPin('');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pin, pinHash, onSuccess]);

  return (
    <div>
      <p className="login-lead">あんしょうばんごう（4けた）</p>

      {/* 入力済みの桁を ● で表す */}
      <div className={`pin-dots${error ? ' pin-dots--error' : ''}`}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <span key={i} className={`pin-dot${i < pin.length ? ' pin-dot--filled' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-error">ばんごうがちがいます</p>}

      <div className="pin-pad">
        {KEYS.map((k) => (
          <button key={k} className="pin-key" onClick={() => pushDigit(k)}>
            {k}
          </button>
        ))}
        <button className="pin-key pin-key--sub" onClick={clearPin}>
          けす
        </button>
        <button className="pin-key" onClick={() => pushDigit('0')}>
          0
        </button>
        <button className="pin-key pin-key--sub" onClick={onBack}>
          もどる
        </button>
      </div>
    </div>
  );
}
