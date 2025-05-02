import { AutoIncrement, Column, CreatedAt, DataType, DeletedAt, HasOne, PrimaryKey, Table, Model, NotNull } from "sequelize-typescript";
import { NutritionFacts } from "./nutrition-facts.entity";

@Table({
    tableName: "tb_foods",
    modelName: "Food",
    timestamps: true
})
export class Food extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @HasOne(() => NutritionFacts)
    declare nutritionFacts: NutritionFacts;

    @Column(DataType.STRING)
    @NotNull
    declare name: string;
    
    @CreatedAt
    declare createdAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;
}
