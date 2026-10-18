import React, {useEffect, useMemo} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import catalogJson from './catalog.json';

export const LocalFonts: React.FC = () => {
  const css = useMemo(() => {
    return catalogJson.fonts
      .map((f: any) => {
        const url = staticFile(`fonts/${f.file}`);
        return `@font-face {
  font-family: '${f.family}';
  src: url('${url}') format('truetype');
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
}`;
      })
      .join('\n\n');
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) {
      return;
    }
    const handle = delayRender('Loading local typography fonts');
    document.fonts.ready
      .then(() => {
        continueRender(handle);
      })
      .catch((err) => {
        console.warn('Font loading check completed with notice:', err);
        continueRender(handle);
      });
  }, []);

  return <style dangerouslySetInnerHTML={{__html: css}} />;
};
