import { useMemo, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useEventsStore } from '@/store/eventsStore';
import { computeEventMetrics } from '@/utils/dateCalculator';
import { exportShareCard } from '@/utils/shareImageExporter';
import { cn } from '@/lib/utils';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ShareCardPreview from './ShareCardPreview';
import type { CountdownEventWithMetrics } from '../events/EventCard';
import type { ShareTemplateId, ShareSize } from '@/types/share';

interface TemplateOption {
  id: ShareTemplateId;
  name: string;
  previewStyle: React.CSSProperties;
}

const templateOptions: TemplateOption[] = [
  {
    id: 'minimal',
    name: '简约',
    previewStyle: { background: '#ffffff' },
  },
  {
    id: 'warm',
    name: '温馨',
    previewStyle: {
      background:
        'linear-gradient(160deg, #FFE5D4 0%, #FFCBA4 30%, #FFB88C 60%, #FF9A76 100%)',
    },
  },
  {
    id: 'festival',
    name: '节日',
    previewStyle: {
      background:
        'linear-gradient(180deg, #DC2626 0%, #B91C1C 40%, #991B1B 100%)',
    },
  },
  {
    id: 'business',
    name: '商务',
    previewStyle: {
      background:
        'linear-gradient(160deg, #0F172A 0%, #1E3A5F 50%, #0C4A6E 100%)',
    },
  },
];

interface SizeOption {
  id: ShareSize;
  name: string;
}

const sizeOptions: SizeOption[] = [
  { id: 'phone', name: '手机壁纸' },
  { id: 'social', name: '社交分享' },
  { id: 'square', name: '正方形' },
];

export default function ShareModal() {
  const {
    isShareModalOpen,
    shareEventId,
    selectedShareTemplate,
    closeShareModal,
    setSelectedShareTemplate,
  } = useUIStore();
  const { getEventById } = useEventsStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<ShareSize>('social');
  const [isExporting, setIsExporting] = useState(false);

  const processedEvent = useMemo<CountdownEventWithMetrics | null>(() => {
    if (!shareEventId) return null;
    const event = getEventById(shareEventId);
    if (!event) return null;
    const metrics = computeEventMetrics(event);
    return {
      ...event,
      daysRemaining: metrics.daysRemaining,
      nextOccurrence: metrics.nextOccurrence,
      isPast: metrics.isPast,
    };
  }, [shareEventId, getEventById]);

  const handleDownload = async () => {
    if (!previewRef.current || !processedEvent) return;
    setIsExporting(true);
    try {
      await exportShareCard(
        previewRef.current,
        `倒数日-${processedEvent.title}-${Date.now()}.png`
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isShareModalOpen}
      onClose={closeShareModal}
      title="生成精美分享卡片"
      maxWidth="2xl"
    >
      <div className="flex gap-6">
        <div className="w-[35%] flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              选择模板
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {templateOptions.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedShareTemplate(tpl.id)}
                  className={cn(
                    'group relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-200 border-2',
                    selectedShareTemplate === tpl.id
                      ? 'border-primary-500 ring-2 ring-primary-200 scale-[1.02]'
                      : 'border-transparent hover:border-gray-200'
                  )}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={tpl.previewStyle}
                  >
                    <div
                      className={cn(
                        'text-3xl opacity-70',
                        tpl.id === 'minimal' || tpl.id === 'warm'
                          ? 'text-gray-700'
                          : 'text-white'
                      )}
                    >
                      {processedEvent?.icon || '📅'}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 right-0 py-1.5 text-xs font-medium text-center',
                      tpl.id === 'minimal'
                        ? 'bg-gray-100/80 text-gray-700'
                        : tpl.id === 'warm'
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'bg-black/30 text-white backdrop-blur-sm'
                    )}
                  >
                    {tpl.name}
                  </div>
                  {selectedShareTemplate === tpl.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              选择尺寸
            </h3>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={cn(
                    'flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200',
                    selectedSize === size.id
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[65%]">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">预览</h3>
          <div className="aspect-[4/5] max-h-[500px] w-full rounded-2xl overflow-hidden shadow-soft-lg mx-auto bg-gray-100 flex items-center justify-center">
            {processedEvent ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="w-auto h-full max-w-full">
                  <ShareCardPreview
                    ref={previewRef}
                    event={processedEvent}
                    templateId={selectedShareTemplate}
                    size={selectedSize}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">加载中...</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <Button variant="ghost" onClick={closeShareModal}>
          取消
        </Button>
        <Button
          variant="primary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownload}
          disabled={!processedEvent || isExporting}
        >
          {isExporting ? '生成中...' : '下载图片'}
        </Button>
      </div>
    </Modal>
  );
}
