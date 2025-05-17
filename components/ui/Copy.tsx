'use client';
import { useCallback, useState } from 'react';
import { Button } from './Button';
import { ICONS } from '@/util';
import { Tooltip } from './Tooltip';

export function Copy({ value }: Readonly<{ value: string }>) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.storage.persist().then(async () => {
        await navigator.clipboard.writeText(value);
      })
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, [value]);

  const { copied: IconCopied, link: IconLink } = ICONS;

  return (
    <Button
      title='copy'
      onClick={handleCopy}
      className={`transition-all duration-200 ease-in-out ${copied ? '' : 'hover:text-blue-500 focus:text-blue-600'}`}
    >
      {copied ? (
        <Tooltip text='Copied!'>
          <IconCopied />
        </Tooltip>
      ) : (
        <IconLink />
      )}
    </Button>
  );
}
