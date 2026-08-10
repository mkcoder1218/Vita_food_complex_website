"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@frontend/navigation";
import { Clock, MessageSquare, Truck } from "lucide-react";

interface FeedbackFeature {
  title: string;
  description: string;
}

interface FeedbackContent {
  heading?: string;
  description?: string;
  buttonText?: string;
  features?: FeedbackFeature[];
}

export default function FeedbackSection({
  content,
  locale = "en",
}: {
  content?: Record<string, FeedbackContent>;
  locale?: string;
}) {
  const currentContent = content?.[locale] || {
    heading: "Do you have a Feedback or Complain?",
    description:
      "Share your feedback, report an issue, or send us your concerns. We're committed to providing fast support and better service",
    buttonText: "Contact Customer Care",
    features: [
      {
        title: "12/6 days availability",
        description:
          "Our customer care team is available 12 hours a day, 6 days a week to assist you with all your needs",
      },
      {
        title: "Customer feedback & complaints",
        description:
          "We value your input and handle all feedback and complaints with care and priority",
      },
      {
        title: "Reliable distribution network",
        description:
          "Get support for distribution queries, tracking, and logistics assistance from our dedicated team",
      },
    ],
  };

  const icons = [
    <Clock key="clock" className="w-8 h-8 text-[#23B349]" />,
    <MessageSquare key="msg" className="w-8 h-8 text-[#23B349]" />,
    <Truck key="truck" className="w-8 h-8 text-[#23B349]" />,
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-[1664px] mx-auto flex flex-col gap-[160px]">
        <div 
          className="relative w-full rounded-[48px] overflow-hidden min-h-[572px] flex items-center justify-center"
          style={{
            background: `
              radial-gradient(circle at 15% 85%, rgba(255, 236, 25, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 85% 15%, rgba(144, 209, 82, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 20% 10%, rgba(144, 209, 82, 0.4) 0%, transparent 50%),
              #23B349
            `
          }}
        >
          <div className="absolute top-[14.73px] left-[-15.6px] z-10 w-[383.46px] aspect-[1.5] transform rotate-[15.26deg] max-lg:hidden">
            <Image
              src="/assets/feedback/hand-biscuit-left.png"
              alt="Hand holding product"
              fill
              loading="lazy"
              decoding="async"
              quality={80}
              sizes="384px"
              className="object-contain"
            />
          </div>

          <div className="absolute top-[360.53px] left-[320.65px] z-10 w-[203.24px] aspect-square transform rotate-[11.8deg] opacity-70 max-lg:hidden">
            <Image
              src="/assets/feedback/wheat.png"
              alt="Wheat"
              fill
              loading="lazy"
              decoding="async"
              quality={80}
              sizes="204px"
              className="object-contain"
            />
          </div>

          <div className="absolute top-[393.46px] left-[238.89px] z-10 w-[160.22px] aspect-square transform -rotate-[25.2deg] max-lg:hidden">
            <Image
              src="/assets/feedback/yellow-flower.png"
              alt="Yellow Flower"
              fill
              loading="lazy"
              decoding="async"
              quality={80}
              sizes="161px"
              className="object-contain"
            />
          </div>

          <div className="absolute top-[266.07px] left-[1115.4px] z-10 w-[194.43px] aspect-[1.96] transform rotate-[43.88deg] max-lg:hidden">
            <Image
              src="/assets/feedback/floating-biscuit.png"
              alt="Floating Biscuit"
              fill
              loading="lazy"
              decoding="async"
              quality={80}
              sizes="195px"
              className="object-contain"
            />
          </div>

          <div className="absolute top-[189.72px] right-[-50px] lg:left-[1333.69px] z-10 w-[334.08px] aspect-square transform rotate-[7.69deg] max-lg:hidden">
            <Image
              src="/assets/feedback/hand-biscuit-right.png"
              alt="Hand holding product"
              fill
              loading="lazy"
              decoding="async"
              quality={80}
              sizes="335px"
              className="object-contain"
            />
          </div>

          <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-[850px]">
            <h2 className="font-[Funnel_Display,sans-serif] font-extrabold text-[40px] md:text-[69px] leading-[1.1] text-white mb-5">
              {currentContent.heading}
            </h2>
            <p className="font-[Funnel_Display,sans-serif] font-medium text-[16px] md:text-[20.8px] leading-[1.2] text-white mb-10 max-w-[660px]">
              {currentContent.description}
            </p>
            <Link
              href="/contact-customer-care"
              className="inline-flex items-center justify-center bg-[#FFEC19] text-[#404040] rounded-full px-8 py-3 font-[Funnel_Display,sans-serif] font-medium text-[17.3px] hover:bg-yellow-400 transition-colors"
            >
              {currentContent.buttonText}
            </Link>
          </div>
        </div>

        <div className="border-t border-[#8A8C8A] pt-8 md:pt-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {currentContent.features?.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start text-left max-w-[485px] mx-auto md:mx-0">
                <div className="w-[72px] h-[72px] rounded-full border-[2.4px] border-[#E6E6E6] flex items-center justify-center mb-6">
                  {icons[idx] || <MessageSquare className="w-8 h-8 text-[#23B349]" />}
                </div>
                <h3 className="font-outfit font-medium text-[24px] md:text-[28px] text-black mb-3">
                  {feature.title}
                </h3>
                <p className="font-outfit font-light text-[18px] md:text-[20px] text-[#333733] leading-[1.25]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
