import styles from './SplashScreen.module.css';

type SplashScreenProps = {
  onStart: () => void;
};

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <main
      className="relative h-full bg-red-950"
      style={{
        background:
          'linear-gradient(transparent, var(--color-red-950)), url(/livingroom.webp) 35%/cover no-repeat',
      }}
    >
      <div className="absolute top-0 right-[8%] h-full flex flex-col w-1/2 max-w-md">
        <div className="flex-1" />
        <div
          className={`flex flex-col items-center bg-amber-100 rounded-xl py-7 sm:py-10 px-3 sm:px-8 font-semibold shadow-2xl sm:text-lg md:text-xl leading-tight ${styles.instructionsDialog}`}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl/relaxed">
            Instructions:
          </h1>
          <ol className="list-decimal list-outside ml-8 [&_li]:pl-2.5 space-y-6 mt-5 mb-8">
            <li>
              Identify the item.
              <div className="text-2xl/tight mt-1">🍓🍒🍎</div>
            </li>
            <li>Press the correct button before it disappears.</li>
          </ol>
          <button
            className="flex items-center justify-center bg-amber-300 rounded-2xl p-3 px-6 -mb-1 cursor-pointer text-inherit active:bg-amber-400 border-amber-400 border-b-4"
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
