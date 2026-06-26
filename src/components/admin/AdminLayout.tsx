import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}