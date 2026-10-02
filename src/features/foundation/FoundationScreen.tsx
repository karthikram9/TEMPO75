import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  ProgressBar,
  NumberInput,
  Input,
  Switch,
  Checkbox,
  Divider,
} from '@/components/ui';
import { PageContainer, Section } from '@/components/layout';
import { useMobileHeader } from '@/hooks';
import {
  formatWeight,
  formatNumber,
  formatGrams,
  formatPercent,
  formatDay,
} from '@/lib/utils';

export const FoundationScreen: React.FC = () => {
  // Mobile header dynamic testing controls
  const [customHeader, setCustomHeader] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState<string>('Day 12 • Upper Body');
  const [headerSubtitle, setHeaderSubtitle] = useState<string>('Hypertrophy Focus');

  // Dynamic header integration
  useMobileHeader(
    customHeader
      ? {
          title: headerTitle,
          subtitle: headerSubtitle,
          showBack: true,
          onBack: () => setCustomHeader(false),
          rightAction: (
            <Button size="sm" variant="outline" onClick={() => setCustomHeader(false)}>
              Reset
            </Button>
          ),
        }
      : undefined
  );

  // Interactive state demos for components
  const [demoWeight, setDemoWeight] = useState<number>(76.4);
  const [demoProgress, setDemoProgress] = useState<number>(75);
  const [demoSwitch, setDemoSwitch] = useState<boolean>(true);
  const [demoCheckbox, setDemoCheckbox] = useState<boolean>(true);
  const [demoInput, setDemoInput] = useState<string>('Athlete One');
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Live viewport metrics for responsive verification
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getBreakpointLabel = (w: number) => {
    if (w < 768) return 'Mobile (320–767px)';
    if (w < 1024) return 'Tablet (768–1023px)';
    if (w < 1440) return 'Desktop (1024–1439px)';
    return 'Widescreen (1440px+)';
  };

  const handleTestLoad = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 1000);
  };

  return (
    <PageContainer maxWidth="standard">
      {/* Hero Header */}
      <div className="flex flex-col items-center text-center pt-2 pb-8 sm:pt-6 sm:pb-12 border-b border-border/80">
        <Badge variant="accent" size="sm" className="mb-4">
          MODULE 2 • RESPONSIVE SHELL & MOBILE UX
        </Badge>

        <div className="flex flex-col items-center select-none">
          <span className="type-display text-text-primary tracking-tight">
            TEMPO
          </span>
          <span className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-text-primary font-mono leading-none my-1">
            75
          </span>
        </div>

        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-text-secondary">
          75 DAYS <span className="text-text-tertiary">•</span> ONE TRANSFORMATION
        </p>

        {/* Viewport & Breakpoint Readout */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="success" size="md">
            [ SHELL POLISHED ]
          </Badge>
          <Badge variant="outline" size="md" className="font-mono">
            {viewport.width} × {viewport.height}
          </Badge>
          <Badge variant="accent" size="md">
            {getBreakpointLabel(viewport.width)}
          </Badge>
          <Badge variant="default" size="md">
            44PX+ TOUCH OK
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-2xs uppercase tracking-widest text-text-muted font-bold">
          <span>DISCIPLINE</span>
          <span>•</span>
          <span>PRECISION</span>
          <span>•</span>
          <span>PROGRESSION</span>
          <span>•</span>
          <span>CONSISTENCY</span>
        </div>
      </div>

      {/* Responsive Layout Architecture & Breakpoint Specs */}
      <Section
        title="Responsive Breakpoint Matrix"
        subtitle="Layout density dynamically adjusts across 4 distinct viewport tiers"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card
            variant={viewport.width < 768 ? 'elevated' : 'default'}
            padding="md"
            className={viewport.width < 768 ? 'border-accent/40' : ''}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">320–767px</span>
              {viewport.width < 768 && <Badge variant="accent" size="sm">Active</Badge>}
            </div>
            <h4 className="text-sm font-bold text-text-primary">Mobile Viewport</h4>
            <p className="text-xs text-text-secondary mt-1">
              Top safe header, single-column scroll, 44px+ touch targets, persistent bottom nav with safe clearance.
            </p>
          </Card>

          <Card
            variant={viewport.width >= 768 && viewport.width < 1024 ? 'elevated' : 'default'}
            padding="md"
            className={viewport.width >= 768 && viewport.width < 1024 ? 'border-accent/40' : ''}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">768–1023px</span>
              {viewport.width >= 768 && viewport.width < 1024 && <Badge variant="accent" size="sm">Active</Badge>}
            </div>
            <h4 className="text-sm font-bold text-text-primary">Tablet Viewport</h4>
            <p className="text-xs text-text-secondary mt-1">
              Switches to desktop sidebar, 2-column card layouts, 24px horizontal padding, hidden bottom nav.
            </p>
          </Card>

          <Card
            variant={viewport.width >= 1024 && viewport.width < 1440 ? 'elevated' : 'default'}
            padding="md"
            className={viewport.width >= 1024 && viewport.width < 1440 ? 'border-accent/40' : ''}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">1024–1439px</span>
              {viewport.width >= 1024 && viewport.width < 1440 && <Badge variant="accent" size="sm">Active</Badge>}
            </div>
            <h4 className="text-sm font-bold text-text-primary">Desktop Viewport</h4>
            <p className="text-xs text-text-secondary mt-1">
              Quiet performance sidebar, 1280px centered max container, 32px horizontal padding, 3-column metric grids.
            </p>
          </Card>

          <Card
            variant={viewport.width >= 1440 ? 'elevated' : 'default'}
            padding="md"
            className={viewport.width >= 1440 ? 'border-accent/40' : ''}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">1440px+</span>
              {viewport.width >= 1440 && <Badge variant="accent" size="sm">Active</Badge>}
            </div>
            <h4 className="text-sm font-bold text-text-primary">Widescreen</h4>
            <p className="text-xs text-text-secondary mt-1">
              Strictly bounded content max-width (no stretching on 1920px), preserved reading lengths, zero layout thrash.
            </p>
          </Card>
        </div>
      </Section>

      {/* Dynamic Header API Tester (Mobile UX) */}
      <Section
        title="Mobile Header Reusable Context API"
        subtitle="Enables subpages to set dynamic titles, back buttons, and actions"
        className="mt-8"
      >
        <Card variant="default" padding="md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Sliders className="w-4 h-4 text-text-primary" />
                <span>Test Dynamic Mobile Header</span>
              </h4>
              <p className="text-xs text-text-secondary mt-1 max-w-md">
                Toggle to preview how subpages (e.g. active gym workouts) override the top header with a back button, title, and action slot.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={customHeader ? 'primary' : 'outline'}
                size="md"
                onClick={() => setCustomHeader((prev) => !prev)}
              >
                {customHeader ? 'Revert to Brand Header' : 'Simulate Workout Subpage'}
              </Button>
            </div>
          </div>

          {customHeader && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Header Title"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
              />
              <Input
                label="Header Subtitle"
                value={headerSubtitle}
                onChange={(e) => setHeaderSubtitle(e.target.value)}
              />
            </div>
          )}
        </Card>
      </Section>

      {/* Semantic Typography Scale */}
      <Section
        title="Semantic Typography Scale"
        subtitle="Strict hierarchy with tabular alignment for sports metrics (SOP Section 20)"
        className="mt-8"
      >
        <Card variant="default" padding="md">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border/60">
              <span className="type-label w-24 shrink-0">Display</span>
              <span className="type-display text-text-primary">TEMPO 75</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border/60">
              <span className="type-label w-24 shrink-0">H1</span>
              <span className="type-h1 text-text-primary">Heavy Push Session</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border/60">
              <span className="type-label w-24 shrink-0">H2</span>
              <span className="type-h2 text-text-primary">Progressive Overload Targets</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border/60">
              <span className="type-label w-24 shrink-0">H3</span>
              <span className="type-h3 text-text-primary">Barbell Bench Press (Set 3 of 4)</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border/60">
              <span className="type-label w-24 shrink-0">Body</span>
              <span className="type-body text-text-secondary">
                Rest 180 seconds between sets to ensure complete ATP regeneration for maximum mechanical tension.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="type-label w-24 shrink-0">Metric Numbers</span>
              <div className="flex flex-wrap gap-4 text-text-primary">
                <span className="type-metric text-2xl text-text-primary">{formatDay(75)}</span>
                <span className="type-metric text-2xl">{formatWeight(80.0)}</span>
                <span className="type-metric text-2xl text-success">{formatWeight(70.0)}</span>
                <span className="type-metric text-2xl">{formatNumber(9000)} steps</span>
                <span className="type-metric text-2xl text-warning">{formatGrams(50)} fat</span>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Card System Demonstration */}
      <Section
        title="Card System Variants"
        subtitle="Meaningful structured groupings without excessive rounding or shadows (SOP Section 21)"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle>Default Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">
                Subtle surface (`bg-surface`) with standard border. Used for standard grouping cards.
              </p>
            </CardContent>
            <CardFooter>
              <span>Subtle Shadow</span>
              <Badge variant="default" size="sm">Base</Badge>
            </CardFooter>
          </Card>

          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle>Elevated Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">
                Elevated surface (`bg-surface-elevated`) with stronger border. Used for active modals and primary logs.
              </p>
            </CardContent>
            <CardFooter>
              <span>Card Shadow</span>
              <Badge variant="accent" size="sm">Elevated</Badge>
            </CardFooter>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader>
              <CardTitle>Outlined Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">
                Transparent surface with strong technical border. Clean contrast on layered backdrops.
              </p>
            </CardContent>
            <CardFooter>
              <span>Zero Shadow</span>
              <Badge variant="outline" size="sm">Outlined</Badge>
            </CardFooter>
          </Card>

          <Card
            variant="interactive"
            padding="md"
            onClick={() => alert('Interactive card triggered')}
          >
            <CardHeader>
              <CardTitle>Interactive Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-text-secondary">
                Desktop hover feedback + mobile active touch press (`active:scale-[0.99]`). Click to test.
              </p>
            </CardContent>
            <CardFooter>
              <span>Touch / Pointer</span>
              <Badge variant="success" size="sm">Tap Me</Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>

      {/* Button System & Gym Touch Usability */}
      <Section
        title="Button System & Touch Feedback"
        subtitle="44px minimum touch targets, 50px primary CTA, and reduced motion safety"
        className="mt-8"
      >
        <Card variant="default" padding="md">
          <div className="space-y-5">
            <div>
              <span className="type-label block mb-3">Primary CTA (50px Height)</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Zap className="w-5 h-5" />}
                  isLoading={buttonLoading}
                  onClick={handleTestLoad}
                  className="sm:w-auto"
                >
                  Start Workout Session (50px CTA)
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<CheckCircle2 className="w-5 h-5 text-success" />}
                  className="sm:w-auto"
                >
                  Complete Daily Protocol
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <span className="type-label block mb-3">Standard Button Variants (44px Minimum Touch Target)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <Button variant="primary" size="md">
                  Primary
                </Button>
                <Button variant="secondary" size="md">
                  Secondary
                </Button>
                <Button variant="outline" size="md">
                  Outline
                </Button>
                <Button variant="ghost" size="md">
                  Ghost
                </Button>
                <Button variant="danger" size="md">
                  Danger
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Mobile Input UX (iOS Keypad & Stepper) */}
      <Section
        title="Mobile Input UX & Steppers"
        subtitle="iOS decimal keypad invocation, 16px minimum font size, rapid one-handed gym logging"
        className="mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="default" padding="md" className="space-y-4">
            <CardHeader>
              <CardTitle>Gym Weight / Rep Stepper</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NumberInput
                label="Prescribed Load (inputMode='decimal')"
                value={demoWeight}
                onChange={setDemoWeight}
                unit="kg"
                step={0.5}
                min={20}
                max={250}
                inputMode="decimal"
                helperText="16px text-size avoids iOS Safari zoom; 44px +/- touch buttons"
              />

              <Input
                label="Athlete Notes"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="RPE 8.5, smooth lockout"
                helperText="Safe keyboard clearance with scroll-margin-bottom"
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className="space-y-4">
            <CardHeader>
              <CardTitle>Milestone Progress & Toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                label="75-Day Protocol Completion"
                value={demoProgress}
                max={100}
                showValueLabel
                variant="accent"
                size="md"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDemoProgress((p) => Math.max(0, p - 5))}
                >
                  -5%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDemoProgress((p) => Math.min(100, p + 5))}
                >
                  +5%
                </Button>
                <span className="text-xs font-mono text-text-muted self-center ml-auto">
                  {formatPercent(demoProgress)} Tracked
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-2">
                <Switch
                  checked={demoSwitch}
                  onChange={setDemoSwitch}
                  label="Gym Haptic Feedback"
                  description="Subtle vibration trigger on set completion"
                />
                <Divider />
                <Checkbox
                  checked={demoCheckbox}
                  onChange={(e) => setDemoCheckbox(e.target.checked)}
                  label="Strict 75-Day Adherence Rules"
                  description="2 workouts (1 outdoor), 4L water, zero alcohol, progress photo"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
};
