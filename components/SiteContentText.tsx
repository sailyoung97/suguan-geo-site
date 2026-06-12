"use client";

import type { SiteContentKey } from "@/src/config/siteContent";
import { useSiteContent } from "@/src/hooks/useSiteContent";

type SiteContentTextProps = {
  fieldKey: SiteContentKey;
  defaultText: string;
};

export function SiteContentText({ fieldKey, defaultText }: SiteContentTextProps) {
  const { getContent } = useSiteContent();

  return <>{getContent(fieldKey, defaultText)}</>;
}
