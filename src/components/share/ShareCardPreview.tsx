import { forwardRef } from 'react';
import { formatDateDisplay } from '@/utils/dateCalculator';
import { computeEventStatus } from '@/utils/eventStatus';
import type { CountdownEventWithMetrics } from '@/components/events/EventCard';
import type { ShareTemplateId, ShareSize } from '@/types/share';

interface ShareCardPreviewProps {
  event: CountdownEventWithMetrics;
  templateId: ShareTemplateId;
  size?: ShareSize;
}

const aspectRatioMap: Record<ShareSize, string> = {
  phone: 'aspect-[9/16]',
  social: 'aspect-[4/5]',
  square: 'aspect-square',
};

export const ShareCardPreview = forwardRef<HTMLDivElement, ShareCardPreviewProps>(
  function ShareCardPreview({ event, templateId, size = 'social' }, ref) {
    const {
      isToday,
      isFuture,
      isPast,
      statusLabel,
      displayDays,
    } = computeEventStatus(event.daysRemaining, event.isPast);
    const statusText = statusLabel;

    const dateDisplay = formatDateDisplay(
      event.nextOccurrence,
      event.dateType,
      event.lunarDate
    );

    const aspectClass = aspectRatioMap[size];

    const renderMinimal = () => (
      <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-40 h-40 opacity-5">
          <div className="w-full h-full border border-gray-800 rounded-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-60 h-60 opacity-5">
          <div className="w-full h-full border border-gray-800 rounded-full" />
        </div>
        <div className="absolute top-1/3 right-8 w-1 h-32 bg-gray-800/10" />
        <div className="absolute bottom-1/3 left-8 w-24 h-px bg-gray-800/10" />

        <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
          <div className="text-8xl">{event.icon}</div>

          <div>
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-3 leading-tight">
              {event.title}
            </h2>
            <p className="text-gray-500 text-base">{dateDisplay}</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-medium text-gray-500 mb-2">
              {statusText}
            </div>
            <div className="flex items-baseline justify-end gap-2">
              <span
                className={`font-mono font-black text-[7rem] leading-none ${
                  isToday
                    ? 'text-gray-800'
                    : isFuture
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {displayDays}
              </span>
              <span className="text-3xl text-gray-500 font-medium">天</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 tracking-wider">
            时光倒数 · DaysMatter
          </div>
        </div>
      </div>
    );

    const renderWarm = () => (
      <div
        className="w-full h-full relative overflow-hidden flex flex-col"
        style={{
          background:
            'linear-gradient(160deg, #FFE5D4 0%, #FFCBA4 30%, #FFB88C 60%, #FF9A76 100%)',
        }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute top-1/4 left-6 w-16 h-16 rounded-full bg-white/15" />
        <div className="absolute top-1/3 right-10 w-8 h-8 rounded-full bg-white/20" />

        <div className="flex-1 p-10 flex flex-col justify-between relative z-10 text-white">
          <div className="text-8xl drop-shadow-lg">{event.icon}</div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-3 leading-tight drop-shadow">
              {event.title}
            </h2>
            <p className="text-white/80 text-base drop-shadow">{dateDisplay}</p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/30">
            <div className="text-lg font-medium text-white/90 mb-3">
              {statusText}
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="font-mono font-black text-[7rem] leading-none drop-shadow-lg">
                {displayDays}
              </span>
              <span className="text-3xl font-medium text-white/90">天</span>
            </div>
            {isToday && (
              <div className="mt-2 text-xl font-medium text-white animate-pulse">
                就是今天！
              </div>
            )}
          </div>

          <div className="text-center text-sm text-white/60 tracking-wider">
            时光倒数 · DaysMatter
          </div>
        </div>
      </div>
    );

    const renderFestival = () => (
      <div
        className="w-full h-full relative overflow-hidden flex flex-col"
        style={{
          background:
            'linear-gradient(180deg, #DC2626 0%, #B91C1C 40%, #991B1B 100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 text-[120px]">福</div>
          <div className="absolute bottom-10 right-10 text-[100px] rotate-12">喜</div>
        </div>
        <div className="absolute top-6 left-6 right-6 bottom-6 rounded-3xl border-4 border-yellow-400/50" />
        <div className="absolute top-10 left-10 right-10 bottom-10 rounded-2xl border border-yellow-300/30" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-yellow-400/20 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-400/20 blur-2xl" />

        <div className="flex-1 p-12 flex flex-col justify-between relative z-10 text-white">
          <div className="text-center">
            <div className="text-9xl drop-shadow-xl">{event.icon}</div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-display font-bold mb-4 leading-tight drop-shadow-lg text-yellow-100">
              {event.title}
            </h2>
            <p className="text-yellow-200/80 text-lg">{dateDisplay}</p>
          </div>

          <div className="text-center">
            <div className="text-xl font-medium text-yellow-200 mb-3">
              {statusText}
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="font-mono font-black text-[7rem] leading-none text-yellow-300 drop-shadow-2xl">
                {displayDays}
              </span>
              <span className="text-3xl font-medium text-yellow-200">天</span>
            </div>
            {isToday && (
              <div className="mt-2 text-2xl font-medium text-yellow-300 animate-pulse">
                🎉 恭喜！就是今天！
              </div>
            )}
          </div>

          <div className="text-center text-sm text-yellow-200/50 tracking-wider">
            时光倒数 · DaysMatter
          </div>
        </div>
      </div>
    );

    const renderBusiness = () => (
      <div
        className="w-full h-full relative overflow-hidden flex flex-col"
        style={{
          background:
            'linear-gradient(160deg, #0F172A 0%, #1E3A5F 50%, #0C4A6E 100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-px h-1/3 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
        <div className="absolute top-1/3 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
          <div className="text-7xl drop-shadow-lg">{event.icon}</div>

          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-3 leading-tight">
              {event.title}
            </h2>
            <p className="text-blue-200/60 text-base font-mono">
              {dateDisplay}
            </p>
          </div>

          <div className="border border-blue-400/20 rounded-2xl p-8 bg-blue-900/20 backdrop-blur-sm">
            <div className="text-lg font-medium text-blue-200/70 mb-3 text-center tracking-widest uppercase">
              {statusText}
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <span
                className={`font-mono font-black text-[7rem] leading-none ${
                  isPast
                    ? 'text-gray-400'
                    : 'bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'
                }`}
              >
                {displayDays}
              </span>
              <span className="text-3xl text-blue-200/70 font-medium">天</span>
            </div>
          </div>

          <div className="text-center text-sm text-blue-300/40 tracking-[0.3em] font-mono">
            DAYS MATTER
          </div>
        </div>
      </div>
    );

    const renderTemplate = () => {
      switch (templateId) {
        case 'minimal':
          return renderMinimal();
        case 'warm':
          return renderWarm();
        case 'festival':
          return renderFestival();
        case 'business':
          return renderBusiness();
        default:
          return renderWarm();
      }
    };

    return (
      <div ref={ref} className={`w-full ${aspectClass} rounded-2xl overflow-hidden`}>
        {renderTemplate()}
      </div>
    );
  }
);

export default ShareCardPreview;
