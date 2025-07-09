import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Timeline, TimelineItem, TimelineContent, TimelineIndicator, TimelineTitle, TimelineSeparator, TimelineDate, TimelineHeader } from '@/components/ui/timeline';
import { 
  Users, 
  DollarSign, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Zap,
  Package,
  Settings,
  GraduationCap,
  BarChart3,
  Rocket,
  Shield,
  AlertCircle,
  ChevronRight,
  Building2,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { softwareToolData, SoftwareToolModel } from '@/temp-data/software-tool-data';
import { motion } from 'framer-motion';

interface RequirementsForm {
  teamSize: string;
  budget: string;
  useCase: string;
  timeline: string;
  currentTools: string;
  painPoints: string;
  industry: string;
}

interface ImplementationPhase {
  day: string;
  title: string;
  tasks: string[];
  milestone: string;
  responsible: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ToolRecommendation extends SoftwareToolModel {
  fitScore: number;
  monthlyTotalCost: number;
  implementationDays: number;
  roiMonths: number;
}

export const ToolDiscoveryJourney: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [requirements, setRequirements] = useState<RequirementsForm>({
    teamSize: '',
    budget: '',
    useCase: '',
    timeline: '30',
    currentTools: '',
    painPoints: '',
    industry: ''
  });
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [activePhase, setActivePhase] = useState(1);

  // Generate tool recommendations based on requirements
  const recommendations = useMemo<ToolRecommendation[]>(() => {
    if (!requirements.useCase || !requirements.budget) return [];

    // Simple recommendation algorithm
    const budgetNum = parseFloat(requirements.budget) || 0;
    const teamSizeNum = parseInt(requirements.teamSize) || 1;

    return softwareToolData
      .filter(tool => {
        const monthlyPrice = tool.pricing.startingPrice || 0;
        const totalMonthlyCost = monthlyPrice * teamSizeNum;
        return totalMonthlyCost <= budgetNum;
      })
      .map(tool => {
        const monthlyPrice = tool.pricing.startingPrice || 0;
        const totalMonthlyCost = monthlyPrice * teamSizeNum;
        
        // Calculate fit score based on various factors
        let fitScore = 70; // Base score
        
        // Adjust based on pricing fit
        if (totalMonthlyCost <= budgetNum * 0.5) fitScore += 10;
        if (tool.pricing.type === 'free') fitScore += 15;
        if (tool.rating >= 4.5) fitScore += 5;
        
        // Random adjustments for demo
        fitScore += Math.random() * 10;
        fitScore = Math.min(100, fitScore);

        return {
          ...tool,
          fitScore: Math.round(fitScore),
          monthlyTotalCost: totalMonthlyCost,
          implementationDays: Math.floor(Math.random() * 20) + 10,
          roiMonths: Math.floor(Math.random() * 12) + 3
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 5);
  }, [requirements]);

  // Generate implementation phases
  const implementationPhases: ImplementationPhase[] = useMemo(() => {
    const phases: ImplementationPhase[] = [
      {
        day: 'Days 1-3',
        title: 'Planning & Preparation',
        tasks: [
          'Finalize tool selection and procurement',
          'Create implementation project plan',
          'Identify key stakeholders and team leads',
          'Set up communication channels'
        ],
        milestone: 'Project kickoff completed',
        responsible: 'Project Manager',
        status: activePhase > 1 ? 'completed' : activePhase === 1 ? 'in-progress' : 'pending'
      },
      {
        day: 'Days 4-7',
        title: 'Environment Setup',
        tasks: [
          'Create accounts and configure initial settings',
          'Set up integrations with existing tools',
          'Configure security and access controls',
          'Import initial data and templates'
        ],
        milestone: 'Tools deployed and configured',
        responsible: 'IT Administrator',
        status: activePhase > 2 ? 'completed' : activePhase === 2 ? 'in-progress' : 'pending'
      },
      {
        day: 'Days 8-14',
        title: 'Team Onboarding',
        tasks: [
          'Conduct initial training sessions',
          'Create user guides and documentation',
          'Set up pilot projects for each team',
          'Establish support channels'
        ],
        milestone: 'Core team trained',
        responsible: 'Training Lead',
        status: activePhase > 3 ? 'completed' : activePhase === 3 ? 'in-progress' : 'pending'
      },
      {
        day: 'Days 15-21',
        title: 'Gradual Rollout',
        tasks: [
          'Expand usage to all team members',
          'Monitor adoption and gather feedback',
          'Refine workflows and processes',
          'Address initial challenges'
        ],
        milestone: 'Full team adoption',
        responsible: 'Department Heads',
        status: activePhase > 4 ? 'completed' : activePhase === 4 ? 'in-progress' : 'pending'
      },
      {
        day: 'Days 22-30',
        title: 'Optimization & Review',
        tasks: [
          'Analyze usage metrics and KPIs',
          'Optimize workflows based on feedback',
          'Document best practices',
          'Plan for long-term success'
        ],
        milestone: 'Implementation complete',
        responsible: 'Project Manager',
        status: activePhase > 5 ? 'completed' : activePhase === 5 ? 'in-progress' : 'pending'
      }
    ];

    return phases;
  }, [activePhase]);

  const handleRequirementChange = (field: keyof RequirementsForm, value: string) => {
    setRequirements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalCosts = () => {
    const selected = recommendations.filter(tool => selectedTools.includes(tool.name));
    const monthlyTotal = selected.reduce((sum, tool) => sum + tool.monthlyTotalCost, 0);
    const annualTotal = monthlyTotal * 12;
    const implementationCost = selected.length * 500; // Simplified implementation cost
    
    return { monthlyTotal, annualTotal, implementationCost };
  };

  const calculateROI = () => {
    const costs = calculateTotalCosts();
    const teamSizeNum = parseInt(requirements.teamSize) || 1;
    
    // Simplified ROI calculation
    const productivityGain = teamSizeNum * 2 * 160 * 50; // hours saved * hourly rate
    const annualSavings = productivityGain - costs.annualTotal;
    const roiPercentage = (annualSavings / costs.annualTotal) * 100;
    
    return {
      annualSavings: Math.max(0, annualSavings),
      roiPercentage: Math.max(0, roiPercentage),
      paybackMonths: costs.annualTotal > 0 ? Math.ceil(costs.implementationCost / (annualSavings / 12)) : 0
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Software Adoption Journey
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover, plan, and implement the perfect software stack for your team with our guided journey
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-medium">Journey Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </span>
          </div>
          <Progress value={currentStep * 25} className="h-2" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            {['Requirements', 'Discovery', 'Planning', 'Implementation'].map((step, index) => (
              <div
                key={step}
                className={cn(
                  "text-center",
                  currentStep > index + 1 ? "text-primary" : 
                  currentStep === index + 1 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium",
                  currentStep > index + 1 ? "bg-primary text-primary-foreground" :
                  currentStep === index + 1 ? "bg-primary/20 text-primary" : "bg-muted"
                )}>
                  {currentStep > index + 1 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Requirements Gathering */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Tell Us About Your Needs
              </CardTitle>
              <CardDescription>
                Help us understand your team and requirements to provide personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">
                    <Users className="h-4 w-4 inline mr-2" />
                    Team Size
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    placeholder="e.g., 25"
                    value={requirements.teamSize}
                    onChange={(e) => handleRequirementChange('teamSize', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Monthly Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 5000"
                    value={requirements.budget}
                    onChange={(e) => handleRequirementChange('budget', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Industry
                  </Label>
                  <Select value={requirements.industry} onValueChange={(value) => handleRequirementChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Implementation Timeline (days)
                  </Label>
                  <Select value={requirements.timeline} onValueChange={(value) => handleRequirementChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCase">
                  <Target className="h-4 w-4 inline mr-2" />
                  Primary Use Case
                </Label>
                <Input
                  id="useCase"
                  placeholder="e.g., Project management and team collaboration"
                  value={requirements.useCase}
                  onChange={(e) => handleRequirementChange('useCase', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentTools">
                  <Package className="h-4 w-4 inline mr-2" />
                  Current Tools (if any)
                </Label>
                <Input
                  id="currentTools"
                  placeholder="e.g., Email, Spreadsheets, Basic PM tool"
                  value={requirements.currentTools}
                  onChange={(e) => handleRequirementChange('currentTools', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="painPoints">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Main Pain Points
                </Label>
                <Input
                  id="painPoints"
                  placeholder="e.g., Poor collaboration, manual processes, lack of visibility"
                  value={requirements.painPoints}
                  onChange={(e) => handleRequirementChange('painPoints', e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!requirements.teamSize || !requirements.budget || !requirements.useCase}
                  className="gap-2"
                >
                  Continue to Discovery
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Tool Discovery */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recommended Tools for Your Journey
              </CardTitle>
              <CardDescription>
                Based on your requirements, we've identified these tools that best fit your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {recommendations.map((tool) => (
                  <Card 
                    key={tool.name}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedTools.includes(tool.name) && "ring-2 ring-primary"
                    )}
                    onClick={() => {
                      setSelectedTools(prev => 
                        prev.includes(tool.name) 
                          ? prev.filter(t => t !== tool.name)
                          : [...prev, tool.name]
                      );
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <span className="text-lg font-semibold">
                                {tool.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{tool.name}</h4>
                              <p className="text-sm text-muted-foreground">{tool.category}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {tool.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {tool.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Fit Score</span>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${tool.fitScore}%` }}
                                  />
                                </div>
                                <span className="font-medium">{tool.fitScore}%</span>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Monthly Cost</span>
                              <p className="font-medium mt-1">${tool.monthlyTotalCost}</p>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Setup Time</span>
                              <p className="font-medium mt-1">{tool.implementationDays} days</p>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">ROI Timeline</span>
                              <p className="font-medium mt-1">{tool.roiMonths} months</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all",
                            selectedTools.includes(tool.name) 
                              ? "bg-primary border-primary" 
                              : "border-muted-foreground"
                          )}>
                            {selectedTools.includes(tool.name) && (
                              <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="gap-2"
                >
                  Back to Requirements
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedTools.length === 0}
                  className="gap-2"
                >
                  Continue to Planning
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Implementation Planning */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Budget & ROI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${calculateTotalCosts().monthlyTotal}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ${calculateTotalCosts().annualTotal} annually
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Implementation Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${calculateTotalCosts().implementationCost}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  One-time investment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expected ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {calculateROI().roiPercentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Payback in {calculateROI().paybackMonths} months
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                30-Day Implementation Timeline
              </CardTitle>
              <CardDescription>
                Your structured roadmap to successful software adoption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline value={activePhase} onValueChange={setActivePhase}>
                {implementationPhases.map((phase, index) => (
                  <TimelineItem key={index} step={index + 1}>
                    <TimelineHeader>
                      <TimelineIndicator>
                        {phase.status === 'completed' ? (
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        ) : phase.status === 'in-progress' ? (
                          <Clock className="h-3 w-3 text-primary animate-pulse" />
                        ) : null}
                      </TimelineIndicator>
                      <TimelineDate>{phase.day}</TimelineDate>
                      <TimelineTitle className="flex items-center justify-between">
                        <span>{phase.title}</span>
                        <Badge 
                          variant={
                            phase.status === 'completed' ? 'default' :
                            phase.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {phase.status}
                        </Badge>
                      </TimelineTitle>
                    </TimelineHeader>
                    <TimelineSeparator />
                    <TimelineContent>
                      <div className="space-y-3 mt-2">
                        <ul className="space-y-1 text-sm">
                          {phase.tasks.map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Responsible: {phase.responsible}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {phase.milestone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(2)}
              className="gap-2"
            >
              Back to Discovery
            </Button>
            <Button 
              onClick={() => setCurrentStep(4)}
              className="gap-2"
            >
              View Full Implementation Plan
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Complete Implementation Guide */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Your Complete Implementation Package
              </CardTitle>
              <CardDescription>
                Everything you need for successful software adoption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="training">Training</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Selected Tools Summary</h3>
                    <div className="space-y-3">
                      {recommendations
                        .filter(tool => selectedTools.includes(tool.name))
                        .map((tool) => (
                          <Card key={tool.name}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{tool.name}</h4>
                                  <p className="text-sm text-muted-foreground">{tool.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${tool.monthlyTotalCost}/month</p>
                                  <p className="text-sm text-muted-foreground">
                                    for {requirements.teamSize} users
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Success Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Productivity Increase</h4>
                          <p className="text-sm text-muted-foreground">
                            Expected 25-40% improvement in team efficiency
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Cost Savings</h4>
                          <p className="text-sm text-muted-foreground">
                            ${calculateROI().annualSavings.toLocaleString()} annually
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Team Adoption</h4>
                          <p className="text-sm text-muted-foreground">
                            90% adoption rate within 30 days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Process Automation</h4>
                          <p className="text-sm text-muted-foreground">
                            Automate 60% of repetitive tasks
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Training Schedule</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium">Week 1: Foundation Training</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Basic functionality, navigation, and core features
                              </p>
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline">2 hours/day</Badge>
                                  <span className="text-muted-foreground">All team members</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium">Week 2: Advanced Features</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Integrations, automation, and advanced workflows
                              </p>
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline">1 hour/day</Badge>
                                  <span className="text-muted-foreground">Power users & team leads</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Settings className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium">Week 3-4: Optimization</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Best practices, tips & tricks, Q&A sessions
                              </p>
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline">30 min/week</Badge>
                                  <span className="text-muted-foreground">Optional for all</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integration" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Integration Roadmap</h3>
                    <div className="space-y-4">
                      {selectedTools.map((toolName, index) => (
                        <Card key={toolName}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-3">{toolName} Integration Steps</h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  1
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">Set up API connections and authentication</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  2
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">Configure data sync and mapping</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  3
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">Test workflows and automation</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  4
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">Deploy to production environment</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Implementation Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Documentation</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Setup guides for each tool
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Best practices handbook
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Troubleshooting guides
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Support Channels</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Dedicated Slack channel
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Weekly office hours
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              24/7 vendor support
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Templates & Assets</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Project templates
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Workflow automation scripts
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Report dashboards
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Success Tracking</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              KPI dashboard
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Monthly review templates
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ROI tracking spreadsheet
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(3)}
                  className="gap-2"
                >
                  Back to Planning
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline">
                    Download Implementation Guide
                  </Button>
                  <Button className="gap-2">
                    Start Your Journey
                    <Rocket className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};