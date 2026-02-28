'use client';

import { useState, useRef, ChangeEvent } from 'react';

export function ReverseImageSearch() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleTinEyeSearch = () => {
    if (!file || !formRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    const fileInput = formRef.current.querySelector('input[name="image"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.files = dt.files;
      formRef.current.submit();
    }
  };

  const clearUpload = () => {
    setPreviewUrl(null);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'var(--tc-surface)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--tc-border)', textAlign: 'center' }}>
        {!previewUrl ? (
          <div
            style={{ border: '2px dashed var(--tc-border)', borderRadius: '12px', padding: '3rem 2rem', cursor: 'pointer', background: 'var(--tc-primary-soft)' }}
            onClick={() => document.getElementById('reverse-img-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile?.type.startsWith('image/')) {
                setFile(droppedFile);
                setPreviewUrl(URL.createObjectURL(droppedFile));
              }
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}></div>
            <div style={{ color: 'var(--tc-text-main)', fontSize: '1rem', fontWeight: 600 }}>Upload a photo to check</div>
            <div style={{ color: 'var(--tc-text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>Click or drag image here</div>
          </div>
        ) : (
          <>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <button
                onClick={clearUpload}
                style={{ position: 'absolute', top: '-10px', right: '-10px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--tc-border)', border: 'none', color: 'var(--tc-text-main)', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                onClick={() => window.open('https://images.google.com', '_blank')}
                style={{ padding: '0.65rem 1.25rem', background: 'var(--tc-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Search Google Images
              </button>
              <button
                onClick={handleTinEyeSearch}
                disabled={!file}
                style={{ padding: '0.65rem 1.25rem', background: '#f8c200', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: file ? 'pointer' : 'not-allowed', fontSize: '0.9rem', opacity: file ? 1 : 0.6 }}
              >
                🕵️ Search TinEye
              </button>
            </div>

            <div style={{ background: 'var(--tc-primary-soft)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--tc-text-main)', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>
                💡 Drag your image into Google Images to search
              </p>
            </div>
          </>
        )}

        <input id="reverse-img-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        <form ref={formRef} action="https://tineye.com/search" method="POST" encType="multipart/form-data" target="_blank" style={{ display: 'none' }}>
          <input type="file" name="image" />
        </form>

        {previewUrl && (
          <div style={{ color: 'var(--tc-text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginTop: '0.75rem', textAlign: 'left' }}>
            <p>If this image appears on stock photo sites, social media, or other dating profiles, it may be stolen.</p>
            <p style={{ marginTop: '0.4rem' }}>Romance scammers commonly use photos of attractive people found online.</p>
            <p style={{ marginTop: '0.4rem' }}><strong>Not finding results doesn't guarantee the person is real.</strong></p>
            <p style={{ marginTop: '0.75rem' }}>
              <a href="/academy/romance-scams" style={{ color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Learn more about romance scams →
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
