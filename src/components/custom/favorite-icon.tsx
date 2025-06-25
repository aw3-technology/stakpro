export const FavoriteIcon = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none">
      <path
        className={className}
        stroke="#FAFAFA"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.696 7.015c3.17 0 5.304 2.98 5.304 5.75 0 5.63-8.839 10.24-9 10.24-.17 0-9-4.62-9-10.245 0-2.785 2.12-5.755 5.3-5.755 1.81 0 3 .9 3.69 1.71.68-.806 1.88-1.72 3.69-1.72l.016.02Z"
        style={{
          stroke: '#fafafa',
          strokeOpacity: '1',
        }}
      />
    </svg>
  );
};