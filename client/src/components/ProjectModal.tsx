import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
    const { language } = useLanguage();

    if (!project) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] w-[95vw] h-[90vh] max-h-[90vh] flex flex-col font-poppins p-0 border-none shadow-2xl bg-white z-[60] overflow-hidden">

                {/* Header Image Section - Fixed Height */}
                <div className="relative h-64 md:h-80 w-full shrink-0 bg-gray-900">
                    <img
                        src={project.image}
                        alt={project.title[language]}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 md:p-8">
                        <div className="w-full relative z-10">
                            <div className="flex justify-between items-end mb-3">
                                <Badge className="bg-turquoise text-white border-none text-xs md:text-sm px-3 py-1 shadow-sm">
                                    {project.categoryName[language]}
                                </Badge>
                            </div>
                            <DialogTitle className="font-playfair text-2xl md:text-4xl text-white font-bold drop-shadow-md leading-tight">
                                {project.title[language]}
                            </DialogTitle>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/20 z-20 shadow-lg"
                        aria-label="Close modal"
                    >
                        <i className="fas fa-times text-lg w-5 h-5 flex items-center justify-center"></i>
                    </button>
                </div>

                {/* Content Section - Scrollable and Solid White */}
                <div className="flex-1 overflow-y-auto bg-white relative z-50">
                    <div className="p-6 md:p-8 space-y-8 pb-10">

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h4 className="font-playfair text-xl md:text-2xl font-bold text-charcoal flex items-center gap-3">
                                <span className="w-8 h-1 bg-turquoise rounded-full block"></span>
                                {language === 'es' ? 'Sobre el Proyecto' : 'About the Project'}
                            </h4>

                            <DialogDescription className="text-lg md:text-xl text-charcoal-light leading-relaxed font-light">
                                {project.description[language]}
                            </DialogDescription>

                            <div className="prose prose-lg text-charcoal-light max-w-none">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {project.longDescription[language]}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Challenges */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2 text-lg">
                                    <i className="fas fa-clipboard-check text-turquoise"></i>
                                    {language === 'es' ? 'Desafíos & Soluciones' : 'Challenges & Solutions'}
                                </h4>
                                <ul className="space-y-3">
                                    {project.highlights[language].map((highlight, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0"></div>
                                            <span className="text-charcoal-light leading-relaxed">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Results */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2 text-lg">
                                    <i className="fas fa-trophy text-gold"></i>
                                    {language === 'es' ? 'Logros Destacados' : 'Key Achievements'}
                                </h4>
                                <ul className="space-y-3">
                                    {project.results[language].map((result, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <i className="fas fa-star text-gold mt-1 shrink-0"></i>
                                            <span className="text-charcoal-light leading-relaxed">{result}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectModal;
