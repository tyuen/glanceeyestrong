type SplashScreenProps = {
  onStart: () => void;
};

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <main
      className="relative h-full bg-black"
      style={{
        background:
          'linear-gradient(transparent, rgba(0, 0, 0)), url(/livingroom.webp) 35%/cover no-repeat',
      }}
    >
      <div className="absolute top-0 right-[8%] h-full flex flex-col w-1/2 max-w-md">
        <div className="flex-1" />
        <div className="flex flex-col items-center bg-white rounded-xl py-4 sm:py-10 px-3 sm:px-6 font-semibold shadow-2xl text-sm sm:text-lg md:text-2xl leading-tight">
          <ol className="list-decimal list-outside pl-6 space-y-4 mb-6 md:mb-8">
            <li>One glance at the window.</li>
            <li>Identify the item.</li>
            <li>Press the correct button.</li>
          </ol>
          <button
            className="flex items-center justify-center bg-amber-300 rounded-2xl p-3 px-6 cursor-pointer text-inherit active:bg-amber-400 border-amber-400 border-b-4"
            onClick={onStart}
          >
            Pick a Level
          </button>
        </div>
        <div className="flex-2" />
      </div>
    </main>
  );
}
