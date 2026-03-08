function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto text-center space-y-3">
        
        <div className="flex justify-center space-x-6 text-sm">
          <a href="#" className="hover:text-gray-400 transition">
            ข้อกำหนดการใช้                  
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            นโยบายความเป็นส่วนตัว            
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            การจัดการ Cookies
          </a>
        </div>

        <p className="text-xs text-gray-400">
          © Copyright 2026 Com7 Public Company Limited. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;