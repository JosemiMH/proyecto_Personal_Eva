import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
    const { language } = useLanguage();

    if (!project) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[95vh] flex flex-col font-poppins p-0 overflow-hidden border-none shadow-2xl bg-white">
                <div className="relative h-80 w-full shrink-0 group">
                    <img
                        src={project.image}
                        alt={typeof project.title === 'object' ? project.title[language] : project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8">
                        <div className="w-full">
                            <div className="flex justify-between items-end mb-2">
                                <Badge className="bg-turquoise hover:bg-turquoise-dark text-white border-none text-sm px-3 py-1 shadow-sm backdrop-blur-sm">
                                    {typeof project.categoryName === 'object' ? project.categoryName[language] : project.categoryName}
                                </Badge>
                            </div>
                            <DialogTitle className="font-playfair text-3xl md:text-4xl text-white font-bold drop-shadow-lg leading-tight">
                                {typeof project.title === 'object' ? project.title[language] : project.title}
                            </DialogTitle>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10"
                        aria-label="Close modal"
                        title="Close"
                    >
                        <i className="fas fa-times text-lg w-6 h-6 flex items-center justify-center"></i>
                    </button>
                </div>

                <ScrollArea className="flex-grow">
                    <div className="p-8 space-y-10">
                        <div>
                            <h4 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-turquoise rounded-full block"></span>
                                {language === 'es' ? 'Sobre el Proyecto' : 'About the Project'}
                            </h4>
                            <DialogDescription className="text-base md:text-lg text-charcoal-light leading-relaxed whitespace-pre-line font-light">
                                {project.longDescription
                                    ? (typeof project.longDescription === 'object' ? project.longDescription[language] : project.longDescription)
                                    : (typeof project.description === 'object' ? project.description[language] : project.description)
                                }
                            </DialogDescription>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-playfair font-bold text-xl text-charcoal mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                                    <div className="bg-turquoise/10 p-2 rounded-lg">
                                        <i className="fas fa-trophy text-turquoise"></i>
                                    </div>
                                    {language === 'es' ? 'Logros Destacados' : 'Key Highlights'}
                                </h4>
                                <ul className="space-y-4">
                                    {(typeof project.highlights === 'object' ?
                                        project.highlights[language] :
                                        project.highlights
                                    ).map((highlight: string, index: number) => (
                                        <li key={index} className="flex items-start gap-4 group">
                                            <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-turquoise/10 flex items-center justify-center group-hover:bg-turquoise transition-colors">
                                                <i className="fas fa-check text-xs text-turquoise group-hover:text-white transition-colors"></i>
                                            </div>
                                            <span className="text-charcoal-light text-sm leading-relaxed">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {project.results && (
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-playfair font-bold text-xl text-charcoal mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="bg-turquoise/10 p-2 rounded-lg">
                                            <i className="fas fa-chart-line text-turquoise"></i>
                                        </div>
                                        {language === 'es' ? 'Resultados' : 'Results'}
                                    </h4>
                                    <ul className="space-y-4">
                                        {(typeof project.results === 'object' ?
                                            project.results[language] :
                                            project.results
                                        ).map((result: string, index: number) => (
                                            <li key={index} className="flex items-start gap-4 group">
                                                <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-turquoise/10 flex items-center justify-center group-hover:bg-turquoise transition-colors">
                                                    <i className="fas fa-arrow-up text-xs text-turquoise group-hover:text-white transition-colors"></i>
                                                </div>
                                                <span className="text-charcoal-light font-medium text-sm leading-relaxed">{result}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectModal;
