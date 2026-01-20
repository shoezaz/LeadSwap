import type { Meta, StoryObj } from "@storybook/react";
import { Markdown } from "./markdown";

const meta: Meta<typeof Markdown> = {
    title: "App/Shared/Markdown",
    component: Markdown,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
    args: {
        children: `# Hello World

This is a **bold** text and this is *italic* text.

Here's a [link](https://cliqo.com) to Cliqo.

## Features

- Feature one
- Feature two
- Feature three

### Code

\`\`\`js
const greeting = "Hello!";
console.log(greeting);
\`\`\`
`,
    },
};

export const SimpleText: Story = {
    args: {
        children: "This is a simple paragraph of text rendered with markdown.",
    },
};

export const WithList: Story = {
    args: {
        children: `## Getting Started

1. Install the package
2. Configure your settings
3. Start using the API

### Tips
- Keep your API key secure
- Use rate limiting
- Monitor your usage
`,
    },
};

export const WithTable: Story = {
    args: {
        children: `## Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic features |
| Pro | $9/mo | Advanced features |
| Enterprise | Custom | All features |
`,
    },
};

export const WithBlockquote: Story = {
    args: {
        children: `> This is a blockquote. It can contain **formatted** text and even [links](https://example.com).

Regular text continues here.
`,
    },
};
