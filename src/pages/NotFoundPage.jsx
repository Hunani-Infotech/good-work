import React, { useEffect } from 'react'
import Layout from '../components/layout/Layout'
import SiteFooter from '../components/sections/SiteFooter'
import SiteLoader from '../components/ui/SiteLoader'

function NotFoundPage() {

  return (
    <> 
      <main className="main">
        <div className="blur not-found">
          <div className="blur-content">
            <h1>404</h1>
          </div>
        </div>
        </main>
    </>
);
}

export default NotFoundPage;