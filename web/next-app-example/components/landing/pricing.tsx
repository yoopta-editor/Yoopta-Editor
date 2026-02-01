"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Community",
    description: "Perfect for personal projects and learning",
    price: "Free",
    priceDetail: "forever",
    features: [
      "All 20+ plugins included",
      "Full editor API access",
      "MIT License",
      "TypeScript support",
      "Community Discord support",
      "GitHub Issues",
      "Documentation",
    ],
    cta: "Get Started",
    ctaLink: "#get-started",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For teams building production applications",
    price: "$29",
    priceDetail: "/month",
    features: [
      "Everything in Community",
      "Real-time collaboration",
      "Priority email support",
      "Premium themes",
      "Advanced export formats",
      "Custom plugin templates",
      "Private Discord channel",
    ],
    cta: "Coming Soon",
    ctaLink: "#",
    highlighted: true,
    badge: "Popular",
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: "Custom",
    priceDetail: "pricing",
    features: [
      "Everything in Pro",
      "Dedicated support engineer",
      "Custom plugin development",
      "SLA guarantee",
      "On-premise deployment",
      "Security review & compliance",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    ctaLink: "mailto:support@yoopta.dev",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-12 sm:py-16">
      {/* Background */}
      <div className="absolute inset-0 glow-center" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Start free and scale as you grow. The core library is always free
            and open-source.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col p-8 rounded-2xl border transition-all duration-300",
                plan.highlighted
                  ? "border-blue-500/50 bg-gradient-to-b from-blue-500/5 to-violet-500/5 dark:from-blue-500/10 dark:to-violet-500/10 shadow-xl shadow-blue-500/10"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {plan.priceDetail}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.highlighted ? "primary" : "outline"}
                size="lg"
                className="w-full"
                asChild={plan.ctaLink !== "#"}
                disabled={plan.ctaLink === "#"}
              >
                {plan.ctaLink !== "#" ? (
                  <a href={plan.ctaLink}>{plan.cta}</a>
                ) : (
                  <span>{plan.cta}</span>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ link */}
        <p className="text-center mt-12 text-neutral-600 dark:text-neutral-400">
          Have questions?{" "}
          <a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline">
            Check our FAQ
          </a>{" "}
          or{" "}
          <a
            href="https://discord.gg/Dt8rhSTjsn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            join our Discord
          </a>
        </p>
      </div>
    </section>
  );
}
