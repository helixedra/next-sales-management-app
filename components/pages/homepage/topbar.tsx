'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiSearchLine, RiAddFill, RiCloseLine } from 'react-icons/ri';
import ui from '@/app/data/ui.json';
import { useState, useRef } from 'react';

export function TopBar({
  newSaleNumber,
  searchHandler,
}: {
  newSaleNumber: number;
  searchHandler: (query: string) => void;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchHandler(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    searchHandler('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="topBar flex items-center p-6">
      <Button
        variant="default"
        onClick={() => router.push(`/orders/new?number=${newSaleNumber}`)}>
        <RiAddFill style={{ width: '24px', height: '24px' }} />
        {ui.global.add_new}
      </Button>

      <div className="relative flex-1 ml-auto max-w-[300px]">
        <RiSearchLine
          className="absolute left-3 top-3 h-4 w-4 text-zinc-400"
          style={{ width: '16px', height: '16px' }}
        />

        <Input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="pl-10 pr-10 dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm"
        />

        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
            aria-label="Clear search">
            <RiCloseLine style={{ width: '24px', height: '24px' }} />
          </button>
        )}
      </div>
    </div>
  );
}
