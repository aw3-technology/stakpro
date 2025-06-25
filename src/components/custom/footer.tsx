export const Footer = () => {
  return (
    <footer className=" flex flex-col-reverse w-full md:flex-row py-4 gap-4 justify-between items-center text-sm text-muted-foreground">
      <span className="text-sm text-center md:text-start flex-1">© 2024 PixiPro Travel Planner. All rights reserved.</span>
      <div className="flex flex-1 items-center justify-end gap-2 text-sm font-medium">
        <a href="/privacy-policy">Privacy Policy</a>
        •
        <a href="/terms-of-service">Terms of Service</a>
      </div>
    </footer>
  );
};
