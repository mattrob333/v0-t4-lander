"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { submitLead, type LeadState } from "@/app/actions/submit-lead"
import { ChevronLeft, ChevronRight, Check, Building2, User, Mail, Phone, MessageSquare } from "lucide-react"

interface MultiStepLeadFormProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialStep?: number
  title?: string
  variant?: 'assessment' | 'consultation' | 'demo' | 'download'
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  title: string
  employees: string
  industry: string
  budget: string
  timeline: string
  challenges: string
  goals: string
}

const STEPS = [
  { id: 1, title: "About You", icon: User, fields: ['name', 'email', 'phone'] },
  { id: 2, title: "Company Info", icon: Building2, fields: ['company', 'title', 'employees', 'industry'] },
  { id: 3, title: "Project Details", icon: MessageSquare, fields: ['budget', 'timeline', 'challenges', 'goals'] }
]

const VARIANTS = {
  assessment: {
    title: "Schedule Your AI Opportunity Assessment",
    description: "Let's identify your highest-impact AI opportunities",
    finalCTA: "Schedule My Assessment"
  },
  consultation: {
    title: "Book Your Strategic AI Consultation", 
    description: "Get expert guidance on your AI transformation",
    finalCTA: "Book Consultation"
  },
  demo: {
    title: "Request Your Personalized Demo",
    description: "See our AI solutions in action for your industry",
    finalCTA: "Request Demo"
  },
  download: {
    title: "Download Your AI Strategy Guide",
    description: "Get our comprehensive guide to AI implementation",
    finalCTA: "Download Guide"
  }
}

export function MultiStepLeadForm({
  open = false,
  onOpenChange = () => {},
  initialStep = 1,
  title,
  variant = 'assessment'
}: MultiStepLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  
  const [state, action, isPending] = useActionState<LeadState, FormData>(submitLead, { ok: false })
  const variantConfig = VARIANTS[variant]

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(initialStep)
      setFormData({})
      setFieldErrors({})
    }
  }, [open, initialStep])

  // Handle form submission success
  useEffect(() => {
    if (state?.ok) {
      toast({
        title: "Request received",
        description: "We'll contact you within 24 hours to coordinate next steps.",
      })
      onOpenChange(false)
    }
  }, [state, toast, onOpenChange])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const stepConfig = STEPS[step - 1]
    const errors: Record<string, string> = {}
    let isValid = true

    stepConfig.fields.forEach(field => {
      const value = formData[field as keyof FormData]
      if (!value || value.trim() === '') {
        errors[field] = 'This field is required'
        isValid = false
      }
      
      // Email validation
      if (field === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors[field] = 'Please enter a valid email address'
          isValid = false
        }
      }
      
      // Phone validation (optional but if provided, should be valid)
      if (field === 'phone' && value && value.length < 10) {
        errors[field] = 'Please enter a valid phone number'
        isValid = false
      }
    })

    setFieldErrors(errors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    const submitFormData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitFormData.append(key, value)
    })
    
    // Add metadata
    submitFormData.append('source', `multi-step-form-${variant}`)
    submitFormData.append('notes', `${variantConfig.title} request: ${formData.challenges || ''} ${formData.goals || ''}`.trim())
    
    action(submitFormData)
  }

  const progressPercentage = (currentStep / STEPS.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {title || variantConfig.title}
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            {variantConfig.description}
          </p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-[#00A878] border-[#00A878] text-white'
                    : currentStep === step.id
                    ? 'border-[#00A878] text-[#00A878] bg-white'
                    : 'border-gray-300 text-gray-400 bg-gray-50'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-1 ml-2 ${
                    currentStep > step.id ? 'bg-[#00A878]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-[#00A878] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="John Smith"
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@company.com"
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.phone && <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => updateFormData('company', e.target.value)}
                    placeholder="Acme Corporation"
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.company ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.company && <p className="text-red-600 text-sm mt-1">{fieldErrors.company}</p>}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="Chief Technology Officer"
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.title && <p className="text-red-600 text-sm mt-1">{fieldErrors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size *
                    </label>
                    <select
                      id="employees"
                      value={formData.employees || ''}
                      onChange={(e) => updateFormData('employees', e.target.value)}
                      className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                        fieldErrors.employees ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    {fieldErrors.employees && <p className="text-red-600 text-sm mt-1">{fieldErrors.employees}</p>}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      value={formData.industry || ''}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                      className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                        fieldErrors.industry ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select industry</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="logistics">Logistics</option>
                      <option value="insurance">Insurance</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="education">Education</option>
                      <option value="legal">Legal</option>
                      <option value="technology">Technology</option>
                      <option value="other">Other</option>
                    </select>
                    {fieldErrors.industry && <p className="text-red-600 text-sm mt-1">{fieldErrors.industry}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Budget *
                  </label>
                  <select
                    id="budget"
                    value={formData.budget || ''}
                    onChange={(e) => updateFormData('budget', e.target.value)}
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.budget ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select budget</option>
                    <option value="under-25k">Under $25k</option>
                    <option value="25k-50k">$25k - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-250k">$100k - $250k</option>
                    <option value="250k-500k">$250k - $500k</option>
                    <option value="500k+">$500k+</option>
                    <option value="to-be-determined">To be determined</option>
                  </select>
                  {fieldErrors.budget && <p className="text-red-600 text-sm mt-1">{fieldErrors.budget}</p>}
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline *
                  </label>
                  <select
                    id="timeline"
                    value={formData.timeline || ''}
                    onChange={(e) => updateFormData('timeline', e.target.value)}
                    className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                      fieldErrors.timeline ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="6-12-months">6-12 months</option>
                    <option value="12+-months">12+ months</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                  {fieldErrors.timeline && <p className="text-red-600 text-sm mt-1">{fieldErrors.timeline}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1">
                  What challenges are you trying to solve? *
                </label>
                <textarea
                  id="challenges"
                  value={formData.challenges || ''}
                  onChange={(e) => updateFormData('challenges', e.target.value)}
                  placeholder="Describe the business challenges you're facing..."
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                    fieldErrors.challenges ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.challenges && <p className="text-red-600 text-sm mt-1">{fieldErrors.challenges}</p>}
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                  What are your goals for AI implementation? *
                </label>
                <textarea
                  id="goals"
                  value={formData.goals || ''}
                  onChange={(e) => updateFormData('goals', e.target.value)}
                  placeholder="What do you hope to achieve with AI?"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A878]/20 focus:border-[#00A878] ${
                    fieldErrors.goals ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.goals && <p className="text-red-600 text-sm mt-1">{fieldErrors.goals}</p>}
              </div>
            </div>
          )}

          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600" role="alert">
                {state.error}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#00A878] hover:bg-[#00936B] text-white flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#00A878] hover:bg-[#00936B] text-white min-w-[140px]"
                aria-busy={isPending}
              >
                {isPending ? "Submitting..." : variantConfig.finalCTA}
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              🔒 Your information is secure and will never be shared with third parties
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}