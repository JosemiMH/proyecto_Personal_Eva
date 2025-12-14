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
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col font-poppins p-0 overflow-hidden">
                <div className="relative h-64 w-full shrink-0">
                    <img
                        src={project.image}
                        alt={typeof project.title === 'object' ? project.title[language] : project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div>
                            <Badge className="bg-turquoise hover:bg-turquoise-dark mb-2 text-white border-none">
                                {typeof project.categoryName === 'object' ? project.categoryName[language] : project.categoryName}
                            </Badge>
                            <DialogTitle className="font-playfair text-3xl text-white font-bold shadow-sm">
                                {typeof project.title === 'object' ? project.title[language] : project.title}
                            </DialogTitle>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-grow px-6 py-6">
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-playfair text-xl font-bold text-charcoal mb-3 border-b border-gray-100 pb-2">
                                {language === 'es' ? 'Sobre el Proyecto' : 'About the Project'}
                            </h4>
                            <DialogDescription className="text-base text-charcoal-light leading-relaxed whitespace-pre-line">
                                {project.longDescription
                                    ? (typeof project.longDescription === 'object' ? project.longDescription[language] : project.longDescription)
                                    : (typeof project.description === 'object' ? project.description[language] : project.description)
                                }
                            </DialogDescription>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                                    <i className="fas fa-trophy text-turquoise"></i>
                                    {language === 'es' ? 'Logros Destacados' : 'Key Highlights'}
                                </h4>
                                <ul className="space-y-3">
                                    {(typeof project.highlights === 'object' ?
                                        project.highlights[language] :
                                        project.highlights
                                    ).map((highlight: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <i className="fas fa-check text-turquoise mt-1 shrink-0"></i>
                                            <span className="text-sm text-charcoal-light">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {project.results && (
                                <div className="bg-turquoise/5 p-5 rounded-lg border border-turquoise/10">
                                    <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                                        <i className="fas fa-chart-line text-turquoise"></i>
                                        {language === 'es' ? 'Resultados' : 'Results'}
                                    </h4>
                                    <ul className="space-y-3">
                                        {(typeof project.results === 'object' ?
                                            project.results[language] :
                                            project.results
                                        ).map((result: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <i className="fas fa-arrow-up text-turquoise mt-1 shrink-0"></i>
                                                <span className="text-sm text-charcoal-light font-medium">{result}</span>
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
