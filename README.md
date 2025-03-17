# Layouts & UI Experiments

![Layouts & UI Experiments](https://github.com/user-attachments/assets/81590804-81d5-47e0-a43b-701abab66a75)

Check out the live demos of all the layouts and UI experiments, showcased in chronological order:

- [SaaS Dashboard](https://crafted.is/exp1)
- [AI Chat](https://crafted.is/exp2)
- [Dark Table](https://crafted.is/exp3)
- [Crypto Wallet](https://ui-experiment-04.vercel.app/)

## shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

### Usage

```bash
pnpm dlx shadcn@latest init
```

### Adding components

To add components to your app, run the following command at the root of your `experiment-01` app:

```bash
pnpm dlx shadcn@latest add button -c apps/experiment-01
```

This will place the ui components in the `packages/ui/src/components` directory.

### Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/ui/button";
```

## Terms & Usage

You are welcome to use these layouts and UI experiments for both personal and commercial projects, but redistribution or resale (even partial) is not permitted.

All copyrights are owned by [Origin UI](https://originui.com) and [Crafted](https://crafted.is).
