'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { DEMO_PRESETS } from '@/lib/constants';
import { User } from '@/types';
import { UserCheck, Shield, Repeat, Sparkles } from 'lucide-react';

export default function DemoUserSwitcher({ onUserChanged }: { onUserChanged?: () => void }) {
  return null;
}
