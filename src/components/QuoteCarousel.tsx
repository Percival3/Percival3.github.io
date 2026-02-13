import React, { useEffect, useMemo, useState } from 'react';

export type QuoteItem = {
  text: string;
  sub: string;
};

const DEFAULT_QUOTES: QuoteItem[] = [
  { text: '头顶的星空和心中的律令', sub: '理性作为存在' },
  { text: 'Stand Alone Complex', sub: '个体分离，共鸣成网' },
  { text: 'Cogito ergo sum', sub: '我思故我在' },
];

interface QuoteCarouselProps {
  quotes?: QuoteItem[];
}

const TEXT_TYPING_MS = 70;
const SUB_TYPING_MS = 48;
const HOLD_MS = 1700;

export default function QuoteCarousel({ quotes }: QuoteCarouselProps) {
  const resolvedQuotes = useMemo(
    () => (quotes && quotes.length > 0 ? quotes : DEFAULT_QUOTES),
    [quotes],
  );

  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typedSub, setTypedSub] = useState('');

  useEffect(() => {
    setIndex(0);
  }, [resolvedQuotes]);

  useEffect(() => {
    const current = resolvedQuotes[index];
    if (!current) return;

    setTypedText('');
    setTypedSub('');

    let textCursor = 0;
    let subCursor = 0;
    let textTimer: number | undefined;
    let subTimer: number | undefined;
    let nextTimer: number | undefined;

    const scheduleNext = () => {
      if (resolvedQuotes.length < 2) return;
      nextTimer = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % resolvedQuotes.length);
      }, HOLD_MS);
    };

    const startSubTyping = () => {
      subTimer = window.setInterval(() => {
        subCursor += 1;
        setTypedSub(current.sub.slice(0, subCursor));
        if (subCursor >= current.sub.length) {
          window.clearInterval(subTimer);
          scheduleNext();
        }
      }, SUB_TYPING_MS);
    };

    textTimer = window.setInterval(() => {
      textCursor += 1;
      setTypedText(current.text.slice(0, textCursor));
      if (textCursor >= current.text.length) {
        window.clearInterval(textTimer);
        startSubTyping();
      }
    }, TEXT_TYPING_MS);

    return () => {
      if (textTimer) window.clearInterval(textTimer);
      if (subTimer) window.clearInterval(subTimer);
      if (nextTimer) window.clearTimeout(nextTimer);
    };
  }, [index, resolvedQuotes]);

  return (
    <div className="mx-auto flex min-h-[9.6rem] max-w-2xl items-center justify-center md:min-h-[10.4rem]">
      <div className="w-full">
        <blockquote className="text-center text-[1.35rem] md:text-[2rem] font-serif italic leading-[1.35] text-[#f6ead9] dark:text-[#d8efff] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          {typedText}
          <span className="inline-block w-[1px] h-[0.95em] ml-1 align-[-0.04em] bg-current animate-pulse"></span>
        </blockquote>
        <p className="mt-3 text-center text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#d5bd9d] dark:text-[#9fd6ff] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] min-h-[1.2em]">
          {typedSub}
        </p>
      </div>
    </div>
  );
}
