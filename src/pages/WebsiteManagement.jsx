import { useState } from 'react';
import { MapPin, FileText, Trophy } from 'lucide-react';
import { BranchesSection } from '../features/facility/components/facility_section';
import { AwardSection } from '../features/award/components/award_section';
import ArticleManagement from '../features/article/components/article_management';

const WebsiteManagement = () => {

    const [websiteTab, setWebsiteTab] = useState("facilities");

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex gap-2">
                <button
                onClick={() => setWebsiteTab('facilities')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    websiteTab === 'facilities'
                    ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                >
                <MapPin size={18} />
                Chi Nhánh
                </button>
                <button
                onClick={() => setWebsiteTab('awards')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    websiteTab === 'awards'
                    ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                >
                <Trophy size={18} />
                Giải Thưởng
                </button>
                <button
                onClick={() => setWebsiteTab('articles')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    websiteTab === 'articles'
                    ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                >
                <FileText size={18} />
                Bài Viết
                </button>
            </div>
            </div>

            {/* Branches Tab */}
            {websiteTab === 'facilities' && (
            <BranchesSection key="facilities"/>
            )}

            {/* Awards Tab */}
            {websiteTab === 'awards' && (
            <AwardSection key="awards"/>
            )}

            {/* Articles Tab */}
            {websiteTab === 'articles' && (
            <ArticleManagement key="articles"/>
            )}
    </div>
    );
}

export default WebsiteManagement;