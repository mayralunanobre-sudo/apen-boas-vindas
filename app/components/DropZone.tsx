'use client'

import { useState, useRef, type DragEvent } from 'react'

type Props = {
  id: string
  accept?: string
  multiple?: boolean
  file?: File | null
  files?: File[]
  onFile?: (file: File) => void
  onFiles?: (files: File[]) => void
  label?: string
  capture?: 'user' | 'environment'
}

export default function DropZone({
  id,
  accept = 'image/*',
  multiple = false,
  file,
  files,
  onFile,
  onFiles,
  label,
  capture,
}: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFile = multiple ? (files && files.length > 0) : !!file

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)

    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (dropped.length === 0) return

    if (multiple && onFiles) {
      onFiles(dropped)
    } else if (!multiple && onFile) {
      onFile(dropped[0])
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return

    if (multiple && onFiles) {
      onFiles(selected)
    } else if (!multiple && onFile) {
      onFile(selected[0])
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragging
          ? 'border-apen-dark bg-blue-50 scale-[1.01]'
          : hasFile
          ? 'border-apen-medium bg-blue-50'
          : 'border-apen-medium hover:bg-blue-50'
      }`}
    >
      {hasFile ? (
        <div className="flex items-center justify-center gap-2 text-apen-dark">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium truncate">
            {multiple && files
              ? `${files.length} foto${files.length > 1 ? 's' : ''} selecionada${files.length > 1 ? 's' : ''}`
              : file?.name}
          </span>
        </div>
      ) : (
        <div className="text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 text-apen-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">{label ?? 'Arraste a foto aqui ou clique para selecionar'}</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        {...(capture ? { capture } : {})}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
