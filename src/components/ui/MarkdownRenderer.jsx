import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown 
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
          // ... other components
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}