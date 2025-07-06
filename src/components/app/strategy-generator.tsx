"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BrainCircuit,
  Copy,
  Download,
  Loader2,
  Rocket,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getStrategyAction, regenerateStrategyAction } from "@/app/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GenerateStrategyOutput } from "@/ai/flows/generate-strategy";

const strategyFormSchema = z.object({
  startupIdea: z.string().min(10, { message: "Please describe your idea in at least 10 characters." }).max(500),
  market: z.string().optional(),
});

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

const MARKETS = ["AI", "SaaS", "E-commerce", "Health", "Education", "FinTech", "Gaming", "Creator Economy", "Marketplace", "Developer Tools"];

const toTitleCase = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

const formatSectionText = (data: Record<string, string>) => {
    return Object.entries(data).map(([key, value]) => `${toTitleCase(key)}:\n${value}`).join('\n\n');
}

const StrategyAccordionItem = ({ value, icon, title, data, onCopy }: { value: string, icon: React.ReactNode, title: string, data: Record<string, string>, onCopy: () => void }) => {
  return (
    <AccordionItem value={value} className="border rounded-lg bg-background/50">
      <AccordionTrigger className="px-6 hover:no-underline">
        <div className="flex items-center gap-3">
          <span className="text-primary">{icon}</span>
          <span className="text-lg font-semibold font-headline">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6">
        <div className="space-y-4 pt-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <h4 className="font-semibold text-md mb-1">{toTitleCase(key)}</h4>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap font-body">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Section
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function StrategyGenerator() {
  const { toast } = useToast();
  const [strategy, setStrategy] = useState<GenerateStrategyOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategyFormSchema),
    defaultValues: {
      startupIdea: "",
      market: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (strategy && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [strategy]);

  const handleFormAction = (action: (formData: FormData) => Promise<{data: GenerateStrategyOutput | null, error: string | null}>) => {
    if (!form.formState.isValid) {
      form.trigger();
      return;
    }
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      setStrategy(null); // Clear previous results
      const result = await action(formData);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        setStrategy(result.data);
      }
    });
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${section} has been copied.`,
    });
  };

  const getFullStrategyText = () => {
    if (!strategy) return "";
    let fullText = `Startup Idea: ${form.getValues('startupIdea')}\nMarket: ${form.getValues('market') || 'General'}\n\n`;
    
    fullText += `📈 GTM Strategy\n----------------\n${formatSectionText(strategy.gtmStrategy)}\n\n`;
    fullText += `🧩 Feature Roadmap\n----------------\n${formatSectionText(strategy.featureRoadmap)}\n\n`;
    fullText += `🔍 SWOT Analysis\n----------------\n${formatSectionText(strategy.swotAnalysis)}`;
    
    return fullText;
  };
  
  const downloadMarkdown = () => {
    const text = getFullStrategyText();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Rocket className="w-6 h-6" />
          <span>Startup Strategy Generator</span>
        </CardTitle>
        <CardDescription>
          Enter your startup idea and let our AI craft a detailed strategy for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={(e) => { e.preventDefault(); handleFormAction(getStrategyAction); }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="startupIdea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">What's your startup idea?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A mobile app that uses AI to create personalized workout plans."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Select a market (optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="e.g., Health" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MARKETS.map((market) => (
                        <SelectItem key={market} value={market}>{market}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full font-bold" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Strategy
                </>
              )}
            </Button>
          </form>
        </Form>

        <div ref={resultsRef}>
          {isPending && (
            <div className="mt-8 text-center flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-lg">
              <div className="flex justify-center items-center">
                  <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <p className="mt-4 text-muted-foreground font-semibold">AI is thinking... Your strategy is being crafted.</p>
            </div>
          )}

          {strategy && !isPending && (
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-bold text-center font-headline">Your AI-Generated Strategy</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={() => handleFormAction(regenerateStrategyAction)} disabled={isPending} variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button onClick={() => copyToClipboard(getFullStrategyText(), 'Full strategy')} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
                 <Button onClick={downloadMarkdown} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export .md
                </Button>
              </div>
              
              <Accordion type="multiple" defaultValue={['gtm-strategy', 'feature-roadmap', 'swot-analysis']} className="w-full space-y-4">
                <StrategyAccordionItem
                  value="gtm-strategy"
                  icon={<TrendingUp className="w-5 h-5" />}
                  title="GTM Strategy"
                  data={strategy.gtmStrategy}
                  onCopy={() => copyToClipboard(formatSectionText(strategy.gtmStrategy), 'GTM Strategy')}
                />
                <StrategyAccordionItem
                  value="feature-roadmap"
                  icon={<Settings className="w-5 h-5" />}
                  title="Feature Roadmap"
                  data={strategy.featureRoadmap}
                  onCopy={() => copyToClipboard(formatSectionText(strategy.featureRoadmap), 'Feature Roadmap')}
                />
                <StrategyAccordionItem
                  value="swot-analysis"
                  icon={<Search className="w-5 h-5" />}
                  title="SWOT Analysis"
                  data={strategy.swotAnalysis}
                  onCopy={() => copyToClipboard(formatSectionText(strategy.swotAnalysis), 'SWOT Analysis')}
                />
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
