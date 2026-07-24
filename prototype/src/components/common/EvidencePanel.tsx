'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet, FileImage, File, Paperclip, Upload, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { EmptyState } from './EmptyState';
import { useDb, mutate } from '../../lib/store';
import { useSession } from '../../lib/session';
import { newId, nowIso } from '../../lib/id';
import { formatDate } from '../../lib/format';
import type { Persona } from '../../types/core';

function fileIcon(type: string) {
  if (/pdf|doc/.test(type)) return FileText;
  if (/xls|csv/.test(type)) return FileSpreadsheet;
  if (/png|jpg|img/.test(type)) return FileImage;
  return File;
}

/**
 * Evidence & attachments panel (mock). Upload records metadata only — the
 * production capability requires the platform document/object storage service
 * flagged as a PRSMTD gap in the master traceability matrix.
 */
export function EvidencePanel({ collection, entityId }: { collection: string; entityId: string }) {
  const db = useDb();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');

  const items = db.evidence.filter((e) => e.collection === collection && e.entityId === entityId);
  const personas = db.personas as unknown as Persona[];

  const uploaderName = (personaId: string) => {
    const p = personas.find((x) => x.id === personaId);
    return (p && db.users.find((u) => u.id === p.userId)?.name) ?? 'Unknown';
  };

  const add = () => {
    if (!title.trim() || !fileName.trim() || !session) return;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? 'pdf';
    mutate((d) => {
      d.evidence.unshift({
        id: newId(),
        collection,
        entityId,
        title: title.trim(),
        fileName: fileName.trim(),
        fileType: ext,
        sizeKb: Math.floor(Math.random() * 900) + 100,
        uploadedBy: session.persona.id,
        uploadedAt: nowIso(),
        description: description.trim() || undefined,
      });
    });
    setOpen(false);
    setTitle('');
    setFileName('');
    setDescription('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {items.length} evidence item{items.length === 1 ? '' : 's'}
        </p>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Upload /> Attach evidence
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="No evidence attached"
          description="Attach supporting documents, screenshots, extracts or certificates. (Prototype stores metadata only.)"
        />
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg bg-card">
          {items.map((e) => {
            const Icon = fileIcon(e.fileType);
            return (
              <li key={e.id} className="flex items-center gap-3 p-3">
                <span className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">{e.title}</span>
                  <span className="block text-xs text-muted-foreground truncate">
                    {e.fileName} · {e.sizeKb} KB · {uploaderName(e.uploadedBy)} · {formatDate(e.uploadedAt)}
                  </span>
                  {e.description && <span className="block text-xs text-muted-foreground mt-0.5">{e.description}</span>}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Download (simulated in prototype)"
                  onClick={() => alert('Prototype: file downloads are simulated. Production requires the platform document storage capability.')}
                >
                  <Download />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach evidence</DialogTitle>
            <DialogDescription>
              Prototype simulation — records evidence metadata without uploading a file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-title">Title *</Label>
              <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Board approval extract" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-file">File name *</Label>
              <Input id="ev-file" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="e.g. board-minutes-2026-06.pdf" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea id="ev-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={add} disabled={!title.trim() || !fileName.trim()}>Attach</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
