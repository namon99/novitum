import { useEffect } from "react";
import * as THREE from 'three';
import SceneInit from "@/pages/scene/SceneInit";

export default function Home() {
    useEffect(() => {
        const scene = new SceneInit();
        scene.initScene();
        scene.animate();

        // Возвращаем функцию очистки, если это необходимо
        return () => {
            // Очистка ресурсов или выполнение других операций при размонтировании компонента
            // Например, можно удалить объекты сцены, освободить память и т.д.
        };
    }, []); // Пустой массив зависимостей, чтобы этот эффект запускался только один раз

    // Возвращаем JSX для отображения на странице
    return (
        <div className="flex flex-col items-center justify-center">
        </div>
    );
}
