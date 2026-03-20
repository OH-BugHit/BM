import style from './style.module.css';

interface Props {
    image?: string;
    title: string;
    description?: string;
    onClick?: () => void;
}

export default function ContentItem({ title, image, description, onClick }: Props) {
    return (
        <li>
            <button
                onClick={onClick}
                className={style.itemButton}
            >
                {image && (
                    <div className={style.imageContainer}>
                        <img
                            src={image}
                            alt={title}
                            width={280}
                            height={180}
                            style={{ border: '1px solid #888', objectFit: 'cover' }}
                        />
                    </div>
                )}
                <h2>{title}</h2>
                {description && <div className={style.description}>{description}</div>}
            </button>
        </li>
    );
}
