import { CheckIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '@/hooks/use-theme';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4 overflow-x-auto p-2">
      {themes.map((t) => (
        <div key={t.value} className="flex flex-col gap-2">
          <Button
            key={t.value}
            type="button"
            variant="outline"
            onClick={() => setTheme(t.value as 'dark' | 'light' | 'system')}
            className={`relative flex flex-col items-start justify-between w-40 h-28 rounded-2xl transition-colors px-0 py-0 bg-background text-left shadow-sm border-background-elevated
                ${theme === t.value ? 'ring-1 ring-blue-500' : ''}
                hover:border-blue-400`}
          >
            {t.value === 'dark' && (
              <div className="flex flex-1 w-full h-full items-center justify-center overflow-hidden bg-[#2B2E354D] relative rounded-2xl">
                <div className="absolute top-6 left-6 right-0 bottom-0 h-full rounded-tl-2xl bg-[#2B2E354D] flex items-center pl-8">
                  <span className="absolute top-3 left-3 text-base font-medium text-foreground leading-5">
                    Aa
                  </span>
                </div>
              </div>
            )}
            {t.value === 'light' && (
              <div className="flex flex-1 w-full h-full items-center justify-center overflow-hidden bg-[#FFFFFF80] relative rounded-2xl">
                <div className="absolute top-6 left-6 right-0 bottom-0 h-full rounded-tl-2xl bg-[#2B2E350D] flex items-center pl-8">
                  <span className="absolute top-3 left-3 text-base font-medium text-foreground leading-5">
                    Aa
                  </span>
                </div>
              </div>
            )}
            {t.value === 'system' && (
              <div className="flex flex-1 w-full h-full rounded-2xl overflow-hidden">
                <div className="flex flex-1 w-full h-full items-center justify-center overflow-hidden bg-[#2B2E354D] relative">
                  <div className="absolute top-6 left-6 right-0 bottom-0 h-full rounded-tl-2xl bg-[#2B2E354D] flex items-center pl-8">
                    <span className="absolute top-3 left-3 text-base font-medium text-foreground leading-5">
                      Aa
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 w-full h-full items-center justify-center overflow-hidden bg-[#FFFFFF80] relative">
                  <div className="absolute top-6 left-6 right-0 bottom-0 h-full rounded-tl-2xl bg-[#2B2E350D] flex items-center pl-8">
                    <span className="absolute top-3 left-3 text-base font-medium text-foreground leading-5">
                      Aa
                    </span>
                  </div>
                </div>
              </div>
            )}

            {theme === t.value && (
              <span className="absolute bottom-3 right-3 bg-blue-500 rounded-full p-1">
                <CheckIcon className="text-white w-4 h-4" />
              </span>
            )}
          </Button>
          <span className="text-base font-medium text-foreground/70">
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const themes = [
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'System',
    value: 'system',
  },
];
