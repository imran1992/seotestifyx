// @ts-nocheck
import React, { useEffect, useState } from "react";
export default () => {
  return (
    <div>
      <h1>TESTING</h1>
      <script type="application/ld+json">
        {`{
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Introduction to Computer Science and Programming",
      "description": "Introductory CS course laying out the basics.",
      "provider": {
        "@type": "Organization",
        "name": "University of Technology - Eureka",
        "sameAs": "http://www.ut-eureka.edu"
      }}`}
      </script>
    </div>
  );
};
