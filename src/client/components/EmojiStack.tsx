type EmojiStackProps = {
  emojis: string[];
};

export function EmojiStack({ emojis }: EmojiStackProps) {
  return (
    <span className="flex items-center justify-center text-[clamp(2rem,17vw,7rem)] leading-none">
      {emojis.map((emoji, index) => (
        <span
          className={[
            'relative scale-90',
            index > 0 ? 'ml-[-0.42em]' : '',
            index === 1
              ? 'z-10 scale-100 drop-shadow-2xl drop-shadow-black/60'
              : '',
          ].join(' ')}
          key={`${emoji}-${index}`}
        >
          {emoji}
        </span>
      ))}
    </span>
  );
}
