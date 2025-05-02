'use client';
import type { MDXComponents } from 'mdx/types';
import '@/styles/css/mdx.css';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => <h1 className='h1-md'>{children}</h1>,
    h2: ({ children }) => <h2 className='h2-md'>{children}</h2>,
    h3: ({ children }) => <h3 className='h3-md'>{children}</h3>,
    h4: ({ children }) => <h4 className='h4-md'>{children}</h4>,
    h5: ({ children }) => <h5 className='h5-md'>{children}</h5>,
    h6: ({ children }) => <h6 className='h6-md'>{children}</h6>,
    p: ({ children }) => <p className='p-md'>{children}</p>,
    li: ({ children }) => <li className='li-md'>{children}</li>,
    ul: ({ children }) => <ul className='ul-md'>{children}</ul>,
    ol: ({ children }) => <ol className='ol-md'>{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className='blockquote-md'>{children}</blockquote>
    ),
    pre: ({ children }) => <pre className='pre-md'>{children}</pre>,
    code: ({ children }) => <code className='code-md'>{children}</code>,
    img: ({ src, alt }) => <img className='img-md' src={src} alt={alt} />,
    a: ({ href, children }) => (
      <a className='a-md' href={href}>
        {children}
      </a>
    ),
    table: ({ children }) => <table className='table-md'>{children}</table>,
    th: ({ children }) => <th className='th-md'>{children}</th>,
    td: ({ children }) => <td className='td-md'>{children}</td>,
    strong: ({ children }) => <strong className='strong-md'>{children}</strong>,
    em: ({ children }) => <em className='em-md'>{children}</em>,
    hr: () => <hr className='hr-md' />,
    br: () => <br className='br-md' />,
  };
}
