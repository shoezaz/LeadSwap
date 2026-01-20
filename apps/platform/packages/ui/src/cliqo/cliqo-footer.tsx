"use client";

import { cn } from "@leadswap/utils";
import { motion } from "motion/react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CliqoDivider } from "./cliqo-divider";

export interface CliqoFooterLink {
  label: string;
  href: string;
}

export interface CliqoFooterProps extends HTMLAttributes<HTMLElement> {
  copyright?: string;
  links?: CliqoFooterLink[];
  fixed?: boolean;
}

const CliqoFooter = forwardRef<HTMLElement, CliqoFooterProps>(
  (
    {
      className,
      copyright = `© ${new Date().getFullYear()} CLIQO`,
      links = [],
      fixed = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <footer
        ref={ref}
        className={cn(
          fixed && "fixed bottom-0 left-0 right-0",
          "w-full max-w-[1440px] mx-auto",
          "px-6 pt-2 pb-6",
          "z-50",
          className
        )}
        style={
          fixed
            ? {
              backgroundImage:
                "linear-gradient(to top, rgb(10 10 10) 0px, transparent 100%)",
              fontFamily: '"IBM Plex Mono", monospace',
            }
            : {
              fontFamily: '"IBM Plex Mono", monospace',
            }
        }
        {...props}
      >
        <motion.div
          className="flex items-end justify-between w-full text-neutral-400 text-[12px] leading-[16px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {copyright}
          </motion.span>

          {links.length > 0 && (
            <div className="flex items-center gap-1.5">
              {links.map((link, index) => (
                <motion.span
                  key={link.href}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {index > 0 && <span>/</span>}
                  <motion.a
                    href={link.href}
                    className="relative hover:text-neutral-50 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    {link.label}
                    {/* Underline animation */}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-neutral-50"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ originX: 0 }}
                    />
                  </motion.a>
                </motion.span>
              ))}
            </div>
          )}

          {children}
        </motion.div>
      </footer>
    );
  }
);

CliqoFooter.displayName = "CliqoFooter";

// Extended footer with multiple sections
export interface CliqoFooterSection {
  title: string;
  links: CliqoFooterLink[];
}

export interface CliqoFooterExtendedProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  description?: string;
  sections?: CliqoFooterSection[];
  copyright?: string;
  socialLinks?: CliqoFooterLink[];
}

const CliqoFooterExtended = forwardRef<HTMLElement, CliqoFooterExtendedProps>(
  (
    {
      className,
      logo,
      description,
      sections = [],
      copyright = `© ${new Date().getFullYear()} CLIQO. All rights reserved.`,
      socialLinks = [],
      ...props
    },
    ref
  ) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "w-full bg-neutral-950 border-t border-neutral-800",
          "px-6 py-12 md:py-16",
          className
        )}
        {...props}
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Logo & Description */}
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {logo && (
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {logo}
                </motion.div>
              )}
              {description && (
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>

            {/* Link sections */}
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (sectionIndex + 1) }}
              >
                <h4 className="text-neutral-50 text-sm font-medium mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + linkIndex * 0.05 }}
                    >
                      <motion.a
                        href={link.href}
                        className="text-neutral-400 text-sm hover:text-neutral-50 transition-colors relative inline-block"
                        whileHover={{ x: 5 }}
                      >
                        {link.label}
                        <motion.span
                          className="absolute -bottom-0.5 left-0 right-0 h-px bg-neutral-50"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.2 }}
                          style={{ originX: 0 }}
                        />
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <CliqoDivider className="my-8" />

          {/* Bottom section */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] leading-[16px]"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-neutral-400">{copyright}</span>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5 text-neutral-400">
                {socialLinks.map((link, index) => (
                  <motion.span
                    key={link.href}
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    {index > 0 && <span>/</span>}
                    <motion.a
                      href={link.href}
                      className="hover:text-neutral-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.label}
                    </motion.a>
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </footer>
    );
  }
);

CliqoFooterExtended.displayName = "CliqoFooterExtended";

export { CliqoFooter, CliqoFooterExtended };
