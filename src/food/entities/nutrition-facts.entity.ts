import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, NotNull, PrimaryKey, Table, Model } from "sequelize-typescript";
import { Food } from "./food.entity";

@Table({
    tableName: "tb_nutrition_facts",
    modelName: "NutritionFacts"
})
export class NutritionFacts extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Food)
    @Column
    declare foodId: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare calories: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare carbohydrates: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare proteins: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare facts: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare fiber: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare sugar: number;

    @Column({type: DataType.DECIMAL, allowNull: false})
    declare sodium: number;
   
}