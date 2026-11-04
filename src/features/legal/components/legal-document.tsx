import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { LegalNav, type LegalPage } from "./legal-nav";

interface LegalDocumentProps {
  current: LegalPage;
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalDocument({ current, title, updated, children }: LegalDocumentProps) {
  const sections: { id: string; title: string }[] = [];
  const content = Children.toArray(children).map((child) => {
    if (!isValidElement<{ id?: string; children?: ReactNode }>(child) || child.type !== "h2") return child;
    const heading = String(child.props.children);
    const id = child.props.id ?? heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    sections.push({ id, title: heading });
    return cloneElement(child, { id });
  });

  return (
    <main id="main-content" className="legal-document">
      <LegalNav current={current} />
      <article className="legal-article" aria-labelledby="legal-title">
        <header className="legal-header">
          <h1 id="legal-title">{title}</h1>
          <p>Last updated: {updated}</p>
        </header>
        <details className="legal-contents">
          <summary>On this page <ChevronDown size={16} aria-hidden="true" /></summary>
          <nav aria-label="On this page">
            {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          </nav>
        </details>
        <div className="legal-content">{content}</div>
      </article>
    </main>
  );
}
