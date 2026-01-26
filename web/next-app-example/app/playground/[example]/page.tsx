"use client";

import { notFound } from "next/navigation";
import { examples } from "@/components/playground/sidebar";
import { ExampleViewer } from "@/components/playground/example-viewer";

// Get all valid example slugs
const allExamples = examples.flatMap((category) =>
  category.items.map((item) => item.slug)
);

// Generate static params for all examples
// export function generateStaticParams() {
//   return allExamples.map((example) => ({
//     example,
//   }));
// }

// // Generate metadata for each example page
// export function generateMetadata({
//   params,
// }: {
//   params: Promise<{ example: string }>;
// }) {
//   return params.then(({ example }) => {
//     const exampleData = examples
//       .flatMap((c) => c.items)
//       .find((item) => item.slug === example);

//     if (!exampleData) {
//       return {
//         title: "Example Not Found | Yoopta Playground",
//       };
//     }

//     return {
//       title: `${exampleData.name} | Yoopta Playground`,
//       description: exampleData.description,
//     };
//   });
// }

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ example: string }>;
}) {
  const { example } = await params;

  // Check if example exists
  if (!allExamples.includes(example)) {
    notFound();
  }

  // Find example data
  const exampleData = examples
    .flatMap((c) => c.items)
    .find((item) => item.slug === example);

  if (!exampleData) {
    notFound();
  }

  return (
    <ExampleViewer
      slug={example}
      name={exampleData.name}
      description={exampleData.description}
    />
  );
}
