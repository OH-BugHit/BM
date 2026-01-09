import style from './style.module.css';

interface Props {
    image?: string;
    title: string;
    description?: string;
    onClick?: () => void;
}

export default function ContentItem({ title, image, description, onClick }: Props) {
    return (
        <li
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : undefined }}
        >
            {image && (
                <div className={style.imageContainer}>
                    <img
                        src={image}
                        alt={title}
                        width={280}
                        height={180}
                        style={{ border: '1px solid #888' }}
                    />
                </div>
            )}
            <h2>{title}</h2>
            {description && <div className={style.description}>{description}</div>}
        </li>
    );
}
