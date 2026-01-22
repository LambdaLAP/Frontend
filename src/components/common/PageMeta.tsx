import React from "react";
import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description?: string;
  favicon?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({ 
  title, 
  description = "Learn programming with interactive challenges.",
  favicon = "/vite.svg" 
}) => {
  return (
    <Helmet>
      <title>{title} | Lambda LAP</title>
      <meta name="description" content={description} />
      <link rel="icon" type="image/svg+xml" href={favicon} />
    </Helmet>
  );
};

export default PageMeta;
