'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <a href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#3b82f6', fontWeight: 600 }}>
          ← Back to Explorer
        </a>
        <SwaggerUI url="/swagger.json" />
      </div>
    </div>
  );
}
