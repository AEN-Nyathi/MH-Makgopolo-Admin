'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon, QrCode, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <PageHeader
        title="QR Code Generator"
        description="Create custom QR codes with optional logo overlay."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Controls */}
        <Card className="lg:col-span-1 h-fit p-6 flex flex-col gap-6">
          <div>
            <Label htmlFor="url-input">Link Destination</Label>
            <div className="relative group mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Logo Overlay (Optional)</Label>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              className="hidden" 
              onChange={handleLogoUpload} 
            />
            <div className="flex items-center gap-3 mt-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              {logoUrl && (
                <Button 
                  onClick={() => setLogoUrl(null)}
                  variant="destructive"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Preview Area */}
        <Card className="lg:col-span-2 flex flex-col items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {url.trim() ? (
              <motion.div 
                key="qr"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center w-full"
              >
                <div className="bg-white p-12 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 relative mb-12">
                  <QRCodeCanvas 
                    id="qr-canvas"
                    value={url} 
                    size={256}
                    level="H"
                    includeMargin={true}
                    imageSettings={logoUrl ? {
                      src: logoUrl,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    } : undefined}
                    className="rounded-lg border border-slate-100 shadow-sm"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 items-center">
                    <button
                      onClick={downloadQR}
                      className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 transition-all"
                    >
                      <Download className="w-5 h-5 opacity-70" />
                      Export PNG
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Standard Web</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-slate-400 text-center"
              >
                <div className="bg-white p-12 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 relative mb-12 flex items-center justify-center w-[352px] h-[352px]">
                  <div className="w-64 h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50">
                    <QrCode className="w-12 h-12 text-slate-300 opacity-50" />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500">Enter a valid URL to generate your QR code</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </>
  );
}
