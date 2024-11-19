import Link from "next/link";

export default async function ComponentsPage() {
  return (
    <div>
      These are the components
      <Link href="/docs/components/button">Button</Link>
    </div>
  );
}
