const MentoriaFooter = () => {
  return (
    <footer className="bg-[#0A0A0A] py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-3 text-sm text-white/70 md:items-start">
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a href="/politica-privacidade" className="transition-colors hover:text-white">Política de Privacidade</a>
              <span className="hidden text-white/40 md:inline">|</span>
              <a href="/termos" className="transition-colors hover:text-white">Termos</a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a href="mailto:contacto@adrianairia.com" className="transition-colors hover:text-white">contacto@adrianairia.com</a>
              <span className="hidden text-white/40 md:inline">|</span>
              <a href="https://wa.me/351912345678" className="transition-colors hover:text-white">WhatsApp</a>
            </div>
            <p className="text-white/60">Tem dúvidas? Fala connosco no WhatsApp.</p>
          </div>
          <span className="text-sm text-white/60">© 2025 Adriana Iria. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
};

export default MentoriaFooter;
