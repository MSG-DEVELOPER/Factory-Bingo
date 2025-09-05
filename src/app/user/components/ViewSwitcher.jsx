'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Shield } from 'lucide-react';

function ViewSwitcher() {
  const pathname = usePathname();

  const activeClassName = "bg-white/20 text-white";
  const inactiveClassName = "bg-zinc-900/50 text-white/60 hover:bg-white/10";

  const links = [
    { href: '/', label: 'Jugador', icon: Gamepad2 },
    { href: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center p-1 bg-zinc-900/30 backdrop-blur-sm rounded-full">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            pathname === href ? activeClassName : inactiveClassName
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}

export default ViewSwitcher;
