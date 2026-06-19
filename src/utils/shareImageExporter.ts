import html2canvas from 'html2canvas';

export async function exportShareCard(
  elementRef: HTMLElement,
  fileName?: string
): Promise<void> {
  const canvas = await html2canvas(elementRef, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = fileName || `倒数日-分享卡片-${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
