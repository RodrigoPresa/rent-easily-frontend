import React from 'react';

interface AdvertisementViewProps {
  imageUrl: string;
  title: string;
  address: string;
  price: number;
  onFavoriteClick: () => void;
}

const AdvertisementView: React.FC<AdvertisementViewProps> = ({
  imageUrl,
  title,
  address,
  price,
  onFavoriteClick,
}) => {
  return (
    <div className="">
      <img src={imageUrl} alt="Imóvel" className="" />
      <h2>{title}</h2>
      <p>{address}</p>
      <p>Valor do Aluguel: R$ {price}</p>
      <button onClick={onFavoriteClick}>Adicionar aos Favoritos</button>
    </div>
  );
};

export default AdvertisementView;
